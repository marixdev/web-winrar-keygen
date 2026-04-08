/**
 * Galois Field GF((2^15)^17) arithmetic.
 * 
 * Ground field: GF(2^15) with irreducible polynomial x^15 + x + 1
 * Extension field: GF((2^15)^17) with irreducible polynomial y^17 + y^3 + 1
 * 
 * Elements are represented as arrays of 17 uint16 values,
 * each in range [0, 0x7FFF).
 * 
 * Port of WinRarConfig::GF2p15p17Traits from C++ codebase.
 */

const ORDER_GF2p15 = 0x7fff; // 2^15 - 1 = 32767

// ---- Log/Exp tables for GF(2^15) ----
const gf2p15ExpTable = new Uint16Array(0x8000);
const gf2p15LogTable = new Uint16Array(0x8000);

// Initialize tables
(function initTables() {
  gf2p15ExpTable[0] = 1;
  for (let i = 1; i < ORDER_GF2p15; i++) {
    let temp = gf2p15ExpTable[i - 1] * 2;
    if (temp & 0x8000) {
      temp ^= 0x8003; // x^15 + x + 1
    }
    gf2p15ExpTable[i] = temp;
  }
  // Mark initialized
  gf2p15ExpTable[ORDER_GF2p15] = (~gf2p15ExpTable[ORDER_GF2p15]) & 0xffff;

  for (let i = 0; i < ORDER_GF2p15; i++) {
    gf2p15LogTable[gf2p15ExpTable[i]] = i;
  }
})();

// ---- GF((2^15)^17) Element ----
// An element is a Uint16Array of length 17

export type GFElement = Uint16Array; // length 17

export const GF_ELEMENT_SIZE = 17;
export const GF_BIT_SIZE = 15 * 17; // 255 bits
export const GF_DUMP_SIZE = Math.ceil(GF_BIT_SIZE / 8); // 32 bytes

export function gfZero(): GFElement {
  return new Uint16Array(GF_ELEMENT_SIZE);
}

export function gfOne(): GFElement {
  const e = new Uint16Array(GF_ELEMENT_SIZE);
  e[0] = 1;
  return e;
}

export function gfFromItems(items: number[]): GFElement {
  const e = new Uint16Array(GF_ELEMENT_SIZE);
  for (let i = 0; i < Math.min(items.length, GF_ELEMENT_SIZE); i++) {
    if (items[i] >= 0x8000) {
      throw new Error("Element not in GF((2^15)^17)");
    }
    e[i] = items[i];
  }
  return e;
}

export function gfClone(a: GFElement): GFElement {
  return new Uint16Array(a);
}

export function gfIsZero(a: GFElement): boolean {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) {
    if (a[i] !== 0) return false;
  }
  return true;
}

export function gfIsOne(a: GFElement): boolean {
  if (a[0] !== 1) return false;
  for (let i = 1; i < GF_ELEMENT_SIZE; i++) {
    if (a[i] !== 0) return false;
  }
  return true;
}

export function gfEqual(a: GFElement, b: GFElement): boolean {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Addition in GF(2^k) is XOR
export function gfAdd(a: GFElement, b: GFElement): GFElement {
  const result = new Uint16Array(GF_ELEMENT_SIZE);
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export function gfAddAssign(a: GFElement, b: GFElement): void {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) {
    a[i] ^= b[i];
  }
}

export function gfAddOne(a: GFElement): GFElement {
  const result = new Uint16Array(a);
  result[0] ^= 1;
  return result;
}

export function gfAddOneAssign(a: GFElement): void {
  a[0] ^= 1;
}

// Subtraction = Addition in GF(2)
export const gfSub = gfAdd;
export const gfSubAssign = gfAddAssign;

// ---- Multiplication ----

function fullMultiplySchoolBook(
  M: number,
  N: number,
  A: Uint16Array,
  B: Uint16Array
): Uint16Array {
  const result = new Uint16Array(M + N - 1);

  for (let i = 0; i < M; i++) {
    if (A[i]) {
      for (let j = 0; j < N; j++) {
        if (B[j]) {
          let g = gf2p15LogTable[A[i]] + gf2p15LogTable[B[j]];
          if (g >= ORDER_GF2p15) {
            g -= ORDER_GF2p15;
          }
          result[i + j] ^= gf2p15ExpTable[g];
        }
      }
    }
  }

  return result;
}

function modularReduction(N: number, A: Uint16Array): void {
  // Irreducible polynomial: y^17 + y^3 + 1
  for (let i = N - 1; i > 16; i--) {
    if (A[i] !== 0) {
      A[i - 17 + 0] ^= A[i];
      A[i - 17 + 3] ^= A[i];
      A[i] = 0;
    }
  }
}

export function gfMul(a: GFElement, b: GFElement): GFElement {
  const temp = fullMultiplySchoolBook(17, 17, a, b);
  modularReduction(temp.length, temp);
  const result = new Uint16Array(GF_ELEMENT_SIZE);
  result.set(temp.subarray(0, GF_ELEMENT_SIZE));
  return result;
}

export function gfMulAssign(a: GFElement, b: GFElement): GFElement {
  const temp = fullMultiplySchoolBook(17, 17, a, b);
  modularReduction(temp.length, temp);
  a.set(temp.subarray(0, GF_ELEMENT_SIZE));
  return a;
}

// ---- Square ----
export function gfSquare(a: GFElement): GFElement {
  const temp = new Uint16Array(33);

  for (let i = 0; i < 17; i++) {
    if (a[i]) {
      let g = gf2p15LogTable[a[i]] * 2;
      if (g >= ORDER_GF2p15) {
        g -= ORDER_GF2p15;
      }
      temp[2 * i] = gf2p15ExpTable[g];
    } else {
      temp[2 * i] = 0;
    }
  }
  // Odd positions are zero (already initialized to 0)

  modularReduction(33, temp);

  const result = new Uint16Array(GF_ELEMENT_SIZE);
  result.set(temp.subarray(0, GF_ELEMENT_SIZE));
  return result;
}

export function gfSquareAssign(a: GFElement): GFElement {
  const sq = gfSquare(a);
  a.set(sq);
  return a;
}

// ---- Inverse ----
export function gfInverse(a: GFElement): GFElement {
  // Extended Euclidean algorithm in GF((2^15)^17)

  const addScale = (
    A: Uint16Array,
    degARef: { val: number },
    alpha: number,
    j: number,
    B: Uint16Array,
    degB: number
  ) => {
    const logAlpha = gf2p15LogTable[alpha];

    for (let i = 0; i <= degB; i++) {
      if (B[i]) {
        let g = logAlpha + gf2p15LogTable[B[i]];
        if (g >= ORDER_GF2p15) {
          g -= ORDER_GF2p15;
        }
        A[i + j] ^= gf2p15ExpTable[g];
        if (A[i + j] && i + j > degARef.val) {
          degARef.val = i + j;
        }
      }
    }

    while (A[degARef.val] === 0 && degARef.val > 0) {
      degARef.val--;
    }
  };

  // Initialize B = 1
  const B = new Uint16Array(34);
  B[0] = 1;
  const degB = { val: 0 };

  // Initialize C = 0
  const C = new Uint16Array(34);
  const degC = { val: 0 };

  // Initialize F = A
  const F = new Uint16Array(34);
  let isZeroF = true;
  const degF = { val: 0 };
  for (let i = 0; i < 17; i++) {
    F[i] = a[i];
    if (F[i]) {
      isZeroF = false;
      degF.val = i;
    }
  }

  if (isZeroF) {
    throw new Error("Zero doesn't have inverse.");
  }

  // Initialize G = y^17 + y^3 + 1
  const G = new Uint16Array(34);
  G[0] = 1;
  G[3] = 1;
  G[17] = 1;
  const degG = { val: 17 };

  // Use references that we can swap
  let pF = F,
    pG = G,
    pB = B,
    pC = C;
  let pdF = degF,
    pdG = degG,
    pdB = degB,
    pdC = degC;

  while (true) {
    if (pdF.val === 0) {
      // Result = B / F[0]
      const result = new Uint16Array(GF_ELEMENT_SIZE);
      for (let i = 0; i <= pdB.val && i < 17; i++) {
        if (pB[i]) {
          let g = gf2p15LogTable[pB[i]] - gf2p15LogTable[pF[0]];
          if (g < 0) {
            g += ORDER_GF2p15;
          }
          result[i] = gf2p15ExpTable[g];
        } else {
          result[i] = 0;
        }
      }
      return result;
    }

    if (pdF.val < pdG.val) {
      // Swap F <-> G, B <-> C
      let tmp: Uint16Array<ArrayBuffer>;
      tmp = pF; pF = pG; pG = tmp;
      tmp = pB; pB = pC; pC = tmp;
      let tmpD: { val: number };
      tmpD = pdF; pdF = pdG; pdG = tmpD;
      tmpD = pdB; pdB = pdC; pdC = tmpD;
    }

    const j = pdF.val - pdG.val;

    let g = gf2p15LogTable[pF[pdF.val]] - gf2p15LogTable[pG[pdG.val]];
    if (g < 0) {
      g += ORDER_GF2p15;
    }
    const alpha = gf2p15ExpTable[g];

    addScale(pF, pdF, alpha, j, pG, pdG.val);
    addScale(pB, pdB, alpha, j, pC, pdC.val);
  }
}

// ---- Division ----
export function gfDiv(a: GFElement, b: GFElement): GFElement {
  const invB = gfInverse(b);
  return gfMul(a, invB);
}

// ---- Dump / Load (serialization) ----

/**
 * Serialize a GF element to bytes.
 * Matches the C++ Dump method exactly.
 */
export function gfDump(val: GFElement): Uint8Array {
  const result = new Uint8Array(GF_DUMP_SIZE);
  let writeIdx = 0;
  let leftBits = 8;

  for (let i = 0; i < 17; i++) {
    const low8 = val[i] & 0xff;
    const high7 = (val[i] >> 8) & 0x7f;

    if (leftBits === 8) {
      result[writeIdx] = low8;
      writeIdx++;
    } else {
      result[writeIdx] |= (low8 << (8 - leftBits)) & 0xff;
      writeIdx++;
      result[writeIdx] = low8 >> leftBits;
    }

    if (leftBits === 8) {
      result[writeIdx] = high7;
      leftBits = 1;
    } else if (leftBits === 7) {
      result[writeIdx] |= (high7 << 1) & 0xff;
      writeIdx++;
      leftBits = 8;
    } else {
      result[writeIdx] |= (high7 << (8 - leftBits)) & 0xff;
      writeIdx++;
      result[writeIdx] = high7 >> leftBits;
      leftBits = 8 - (7 - leftBits);
    }
  }

  return result;
}

/**
 * Deserialize a GF element from bytes.
 * This is the inverse of gfDump().
 * 
 * We pack 17 x 15-bit values into 32 bytes.
 * This reads them back by streaming bits.
 */
export function gfLoad(buffer: Uint8Array): GFElement {
  if (buffer.length !== GF_DUMP_SIZE) {
    throw new Error("Buffer length must be " + GF_DUMP_SIZE);
  }

  if (buffer[GF_DUMP_SIZE - 1] & 0x80) {
    throw new Error("Not in GF((2^15)^17).");
  }

  const val = new Uint16Array(GF_ELEMENT_SIZE);

  // Stream bits: read 8 bits at a time from buffer, write 15 bits at a time to val
  let bitBuffer = 0;
  let bitsInBuffer = 0;
  let byteIdx = 0;
  
  for (let elemIdx = 0; elemIdx < 17; elemIdx++) {
    while (bitsInBuffer < 15 && byteIdx < GF_DUMP_SIZE) {
      bitBuffer |= buffer[byteIdx] << bitsInBuffer;
      bitsInBuffer += 8;
      byteIdx++;
    }
    val[elemIdx] = bitBuffer & 0x7fff;
    bitBuffer >>= 15;
    bitsInBuffer -= 15;
  }

  return val;
}
