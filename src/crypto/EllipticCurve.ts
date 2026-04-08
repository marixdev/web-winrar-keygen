/**
 * Elliptic Curve over GF(2^m) — specifically GF((2^15)^17).
 *
 * Curve equation: y^2 + xy = x^3 + Ax^2 + B
 */

import type { GFElement } from "./GaloisField";
import {
  gfZero,
  gfClone,
  gfIsZero,
  gfEqual,
  gfAdd,
  gfAddAssign,
  gfAddOne,
  gfMul,
  gfSquare,
  gfDiv,
  gfDump,
} from "./GaloisField";
import { bigintFromBytes } from "./BigIntUtils";

export interface ECCurve {
  A: GFElement;
  B: GFElement;
}

export interface ECPoint {
  curve: ECCurve;
  x: GFElement;
  y: GFElement;
}

export function ecPointCreate(curve: ECCurve): ECPoint {
  return {
    curve,
    x: gfZero(),
    y: gfZero(),
  };
}

export function ecPointFromCoords(
  curve: ECCurve,
  x: GFElement,
  y: GFElement
): ECPoint {
  // Verify: y^2 + xy = x^3 + Ax^2 + B
  // Left = y^2 + xy
  const left = gfAdd(gfSquare(y), gfMul(x, y));
  // Right = (x + A) * x^2 + B
  const xPlusA = gfAdd(x, curve.A);
  const x2 = gfSquare(x);
  const right = gfAdd(gfMul(xPlusA, x2), curve.B);
  
  if (!gfEqual(left, right)) {
    throw new Error("Point is not on the curve.");
  }

  return {
    curve,
    x: gfClone(x),
    y: gfClone(y),
  };
}

export function ecPointClone(p: ECPoint): ECPoint {
  return {
    curve: p.curve,
    x: gfClone(p.x),
    y: gfClone(p.y),
  };
}

export function ecPointIsAtInfinity(p: ECPoint): boolean {
  return gfIsZero(p.x) && gfIsZero(p.y);
}

export function ecPointEqual(a: ECPoint, b: ECPoint): boolean {
  return gfEqual(a.x, b.x) && gfEqual(a.y, b.y);
}

export function ecPointNegate(p: ECPoint): ECPoint {
  return {
    curve: p.curve,
    x: gfClone(p.x),
    y: gfAdd(p.x, p.y),
  };
}

/**
 * Point doubling: 2P
 */
export function ecPointDouble(p: ECPoint): ECPoint {
  if (ecPointIsAtInfinity(p)) {
    return ecPointCreate(p.curve);
  }

  // m = X + Y / X
  const m = gfAdd(gfDiv(p.y, p.x), p.x);

  // NewX = m^2 + m + A
  let newX = gfSquare(m);
  gfAddAssign(newX, m);
  gfAddAssign(newX, p.curve.A);

  // NewY = X^2 + (m + 1) * NewX
  const mPlusOne = gfAddOne(m);
  let newY = gfMul(mPlusOne, newX);
  gfAddAssign(newY, gfSquare(p.x));

  return {
    curve: p.curve,
    x: newX,
    y: newY,
  };
}

/**
 * Point addition: P + Q
 */
export function ecPointAdd(p: ECPoint, q: ECPoint): ECPoint {
  if (ecPointIsAtInfinity(p)) {
    return ecPointClone(q);
  }
  if (ecPointIsAtInfinity(q)) {
    return ecPointClone(p);
  }

  if (gfEqual(p.x, q.x)) {
    if (gfEqual(p.y, q.y)) {
      // Same point -> double
      return ecPointDouble(p);
    } else {
      // P + (-P) = O (point at infinity)
      return ecPointCreate(p.curve);
    }
  }

  // m = (Y0 + Y1) / (X0 + X1)
  const m = gfDiv(gfAdd(p.y, q.y), gfAdd(p.x, q.x));

  // NewX = m^2 + m + X0 + X1 + A
  let newX = gfSquare(m);
  gfAddAssign(newX, m);
  gfAddAssign(newX, p.x);
  gfAddAssign(newX, q.x);
  gfAddAssign(newX, p.curve.A);

  // NewY = m * (X0 + NewX) + NewX + Y0
  let newY = gfMul(m, gfAdd(p.x, newX));
  gfAddAssign(newY, newX);
  gfAddAssign(newY, p.y);

  return {
    curve: p.curve,
    x: newX,
    y: newY,
  };
}

/**
 * Scalar multiplication: k * P using double-and-add.
 */
export function ecPointMul(p: ECPoint, k: bigint): ECPoint {
  if (k === 0n) {
    return ecPointCreate(p.curve);
  }
  if (k < 0n) {
    return ecPointMul(ecPointNegate(p), -k);
  }

  let result = ecPointCreate(p.curve);
  let addend = ecPointClone(p);

  let scalar = k;
  while (scalar > 0n) {
    if (scalar & 1n) {
      result = ecPointAdd(result, addend);
    }
    addend = ecPointDouble(addend);
    scalar >>= 1n;
  }

  return result;
}

/**
 * Dump the X coordinate of a point in compressed format.
 * Returns [prefix_byte, ...x_bytes].
 * prefix = 0x02 if LSB(Y/X) == 0, 0x03 if LSB(Y/X) == 1.
 */
export function ecPointDumpCompressed(p: ECPoint): Uint8Array {
  const xDump = gfDump(p.x);

  // Determine prefix: check if Y/X has LSB set (bit 0 of dump byte 0)
  let prefix = 0x02;
  if (!gfIsZero(p.x)) {
    const yDivX = gfDiv(p.y, p.x);
    const zDump = gfDump(yDivX);
    if (zDump[0] & 1) {
      prefix = 0x03;
    }
  }

  // Reverse x bytes to big-endian
  const xBytesBE = new Uint8Array(xDump.length);
  for (let i = 0; i < xDump.length; i++) {
    xBytesBE[i] = xDump[xDump.length - 1 - i];
  }

  const result = new Uint8Array(1 + xBytesBE.length);
  result[0] = prefix;
  result.set(xBytesBE, 1);
  return result;
}

/**
 * Get the X coordinate of a point as a BigInt.
 * Dump the GF element, interpret as big-endian bytes → BigInt.
 */
export function ecPointGetXAsBigInt(p: ECPoint): bigint {
  const dump = gfDump(p.x);
  return bigintFromBytes(dump, true); // little-endian dump
}
