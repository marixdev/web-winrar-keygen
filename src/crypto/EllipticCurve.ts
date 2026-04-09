/**
 * Elliptic-curve arithmetic over the composite field GF((2¹⁵)¹⁷).
 *
 * Curve equation:  y² + xy = x³ + Ax² + B
 *
 * - Point at infinity is represented as (0, 0).
 * - Compressed encoding: 1-byte prefix (0x02 or 0x03) + 32-byte x-coordinate.
 */

import {
  type GFElement,
  GF_ELEMENT_SIZE,
  GF_DUMP_SIZE,
  gfZero, gfClone, gfIsZero, gfEqual,
  gfAdd, gfMul, gfSquare, gfDiv,
  gfDump, gfLoad,
} from './GaloisField';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ECCurve {
  A: GFElement;
  B: GFElement;
}

export interface ECPoint {
  x: GFElement;
  y: GFElement;
}

// ─── Construction ────────────────────────────────────────────────────────────

export function ecPointCreate(): ECPoint {
  return { x: gfZero(), y: gfZero() };
}

export function ecPointFromCoords(x: GFElement, y: GFElement): ECPoint {
  return { x: gfClone(x), y: gfClone(y) };
}

export function ecPointClone(P: ECPoint): ECPoint {
  return { x: gfClone(P.x), y: gfClone(P.y) };
}

// ─── Predicates ──────────────────────────────────────────────────────────────

export function ecPointIsAtInfinity(P: ECPoint): boolean {
  return gfIsZero(P.x) && gfIsZero(P.y);
}

export function ecPointEqual(P: ECPoint, Q: ECPoint): boolean {
  return gfEqual(P.x, Q.x) && gfEqual(P.y, Q.y);
}

// ─── Negate ──────────────────────────────────────────────────────────────────

/** −P = (x, x + y)  on a Binary EC. */
export function ecPointNegate(P: ECPoint): ECPoint {
  return { x: gfClone(P.x), y: gfAdd(P.x, P.y) };
}

// ─── Doubling ────────────────────────────────────────────────────────────────

/**
 * Point doubling.
 *
 * m = x + y/x
 * x' = m² + m + A
 * y' = x² + (m + 1) · x'
 */
export function ecPointDouble(curve: ECCurve, P: ECPoint): ECPoint {
  if (ecPointIsAtInfinity(P) || gfIsZero(P.x)) return ecPointCreate();

  const m = gfAdd(P.x, gfDiv(P.y, P.x));

  const newX = gfAdd(gfAdd(gfSquare(m), m), curve.A);

  // m + 1
  const m1 = new Uint16Array(GF_ELEMENT_SIZE);
  m1.set(m); m1[0] ^= 1;

  const newY = gfAdd(gfSquare(P.x), gfMul(m1, newX));

  return { x: newX, y: newY };
}

// ─── Addition ────────────────────────────────────────────────────────────────

/**
 * Point addition P + Q.
 *
 * m = (y₀ + y₁) / (x₀ + x₁)
 * x' = m² + m + x₀ + x₁ + A
 * y' = m(x₀ + x') + x' + y₀
 */
export function ecPointAdd(curve: ECCurve, P: ECPoint, Q: ECPoint): ECPoint {
  if (ecPointIsAtInfinity(P)) return ecPointClone(Q);
  if (ecPointIsAtInfinity(Q)) return ecPointClone(P);

  if (gfEqual(P.x, Q.x)) {
    // Same x: either P = Q (double) or P = −Q (infinity)
    return gfEqual(P.y, Q.y)
      ? ecPointDouble(curve, P)
      : ecPointCreate();
  }

  const dx = gfAdd(P.x, Q.x);
  const dy = gfAdd(P.y, Q.y);
  const m  = gfDiv(dy, dx);

  const newX = gfAdd(gfAdd(gfAdd(gfSquare(m), m), dx), curve.A);
  const newY = gfAdd(gfAdd(gfMul(m, gfAdd(P.x, newX)), newX), P.y);

  return { x: newX, y: newY };
}

// ─── Scalar multiplication (double-and-add, MSB first) ───────────────────────

export function ecPointMul(curve: ECCurve, P: ECPoint, k: bigint): ECPoint {
  if (k === 0n) return ecPointCreate();
  if (k < 0n) return ecPointMul(curve, ecPointNegate(P), -k);

  let R = ecPointCreate();
  const bitLen = k.toString(2).length;

  for (let i = bitLen - 1; i >= 0; i--) {
    R = ecPointDouble(curve, R);
    if ((k >> BigInt(i)) & 1n) {
      R = ecPointAdd(curve, R, P);
    }
  }
  return R;
}

// ─── Compressed serialisation ────────────────────────────────────────────────

/**
 * Dump a point in compressed form:  prefix (1 byte) ‖ x (32 bytes).
 *
 * prefix = 0x04  if point is at infinity
 *          0x02  if y/x has its constant-term bit clear
 *          0x03  if y/x has its constant-term bit set
 */
export function ecPointDumpCompressed(P: ECPoint): Uint8Array {
  const buf = new Uint8Array(1 + GF_DUMP_SIZE);   // 33 bytes

  if (ecPointIsAtInfinity(P)) {
    buf[0] = 0x04;
    return buf;
  }

  const ratio = gfDiv(P.y, P.x);         // y / x
  buf[0] = (ratio[0] & 1) ? 0x03 : 0x02;
  buf.set(gfDump(P.x), 1);
  return buf;
}

/**
 * Restore a point from its compressed form.
 *
 * To decompress we must solve  t² + t = x + A + B/x²  where  t = y/x,
 * then check which solution matches the stored parity bit.
 */
export function ecPointLoadCompressed(curve: ECCurve, data: Uint8Array): ECPoint {
  if (data[0] === 0x04) return ecPointCreate();

  const x = gfLoad(data.subarray(1, 1 + GF_DUMP_SIZE));
  if (gfIsZero(x)) throw new RangeError('Cannot decompress: x = 0');

  // Solve  t² + t = x + A + B/x²   (half-trace method for GF(2^odd))
  const rhs = gfAdd(gfAdd(x, curve.A), gfDiv(curve.B, gfSquare(x)));
  const t = halfTrace(rhs);

  // Verify solution
  const check = gfAdd(gfSquare(t), t);
  if (!gfEqual(check, rhs)) throw new RangeError('No solution — invalid compressed point');

  // Choose the root whose constant bit matches the prefix
  const parityBit = (data[0] === 0x03) ? 1 : 0;
  const tFinal = (t[0] & 1) === parityBit ? t : gfAdd(t, gfFromOne());

  // y = t · x
  const y = gfMul(tFinal, x);
  return { x, y };
}

/** Compute half-trace:  HT(a) = Σ_{i=0}^{(m-1)/2} a^{2^{2i}}  in GF(2^m), m odd.
 *  For our field m = 255. */
function halfTrace(a: GFElement): GFElement {
  let r = gfClone(a);
  for (let i = 1; i <= 127; i++) {
    r = gfSquare(gfSquare(r));   // r = r^{4}
    r = gfAdd(r, a);
  }
  return r;
}

/** One as a GFElement (used for root selection). */
function gfFromOne(): GFElement {
  const e = new Uint16Array(GF_ELEMENT_SIZE);
  e[0] = 1;
  return e;
}
