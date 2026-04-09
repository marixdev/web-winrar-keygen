/**
 * Arithmetic in the composite Galois field GF((2¹⁵)¹⁷).
 *
 * The ground field is GF(2¹⁵) with irreducible polynomial  p(x) = x¹⁵ + x + 1.
 * The extension is degree-17 over that base, with irreducible  q(y) = y¹⁷ + y³ + 1.
 *
 * An element of the composite field is a polynomial of degree ≤ 16 whose
 * coefficients live in GF(2¹⁵).  We store it as a Uint16Array of length 17,
 * where index 0 holds the constant term and index 16 the leading term.
 *
 * Total element size: 15 × 17 = 255 bits.
 */

// ─── Ground-field GF(2¹⁵) tables ────────────────────────────────────────────

const BASE_ORDER = 0x7fff;                        // 2¹⁵ − 1
const EXP = new Uint16Array(BASE_ORDER + 1);      // EXP[i] = α^i
const LOG = new Uint16Array(BASE_ORDER + 1);      // LOG[α^i] = i

{
  // Build discrete-log / exponentiation tables for the generator α
  // whose minimal polynomial is x¹⁵ + x + 1 (feedback mask 0x8003).
  EXP[0] = 1;
  for (let i = 1; i < BASE_ORDER; i++) {
    const doubled = EXP[i - 1] << 1;
    EXP[i] = (doubled & 0x8000) ? (doubled ^ 0x8003) & 0xffff : doubled;
  }
  for (let i = 0; i < BASE_ORDER; i++) LOG[EXP[i]] = i;
}

/** Divide a / b in GF(2¹⁵). */
function baseDiv(a: number, b: number): number {
  if (b === 0) throw new RangeError('Division by zero in GF(2¹⁵)');
  if (a === 0) return 0;
  let e = LOG[a] - LOG[b];
  if (e < 0) e += BASE_ORDER;
  return EXP[e];
}

/** Square an element of GF(2¹⁵). */
function baseSqr(a: number): number {
  if (a === 0) return 0;
  let e = LOG[a] << 1;
  if (e >= BASE_ORDER) e -= BASE_ORDER;
  return EXP[e];
}

// ─── Extension-field element type ────────────────────────────────────────────

/** A polynomial over GF(2¹⁵) with 17 coefficients (degree ≤ 16). */
export type GFElement = Uint16Array;

export const GF_ELEMENT_SIZE = 17;
export const GF_BIT_SIZE     = 15 * 17;                       // 255
export const GF_DUMP_SIZE    = Math.ceil(GF_BIT_SIZE / 8);    // 32

// ─── Construction helpers ────────────────────────────────────────────────────

export function gfZero(): GFElement {
  return new Uint16Array(GF_ELEMENT_SIZE);
}

export function gfOne(): GFElement {
  const e = gfZero();
  e[0] = 1;
  return e;
}

export function gfFromItems(items: number[]): GFElement {
  const e = gfZero();
  const len = Math.min(items.length, GF_ELEMENT_SIZE);
  for (let i = 0; i < len; i++) {
    if (items[i] >= 0x8000) throw new RangeError('Coefficient out of GF(2¹⁵)');
    e[i] = items[i];
  }
  return e;
}

export function gfClone(a: GFElement): GFElement {
  return new Uint16Array(a);
}

// ─── Predicates ──────────────────────────────────────────────────────────────

export function gfIsZero(a: GFElement): boolean {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) if (a[i]) return false;
  return true;
}

export function gfIsOne(a: GFElement): boolean {
  if (a[0] !== 1) return false;
  for (let i = 1; i < GF_ELEMENT_SIZE; i++) if (a[i]) return false;
  return true;
}

export function gfEqual(a: GFElement, b: GFElement): boolean {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) if (a[i] !== b[i]) return false;
  return true;
}

// ─── Addition / subtraction  (identical in characteristic 2) ─────────────────

export function gfAdd(a: GFElement, b: GFElement): GFElement {
  const r = new Uint16Array(GF_ELEMENT_SIZE);
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) r[i] = a[i] ^ b[i];
  return r;
}

export function gfAddAssign(a: GFElement, b: GFElement): void {
  for (let i = 0; i < GF_ELEMENT_SIZE; i++) a[i] ^= b[i];
}

export function gfAddOne(a: GFElement): GFElement {
  const r = new Uint16Array(a);
  r[0] ^= 1;
  return r;
}

export function gfAddOneAssign(a: GFElement): void {
  a[0] ^= 1;
}

export const gfSub       = gfAdd;
export const gfSubAssign = gfAddAssign;

// ─── Multiplication ──────────────────────────────────────────────────────────

/**
 * Schoolbook polynomial multiplication of A (M terms) × B (N terms),
 * with coefficient arithmetic in GF(2¹⁵).
 */
function polyMul(A: Uint16Array, M: number, B: Uint16Array, N: number): Uint16Array {
  const out = new Uint16Array(M + N - 1);
  for (let i = 0; i < M; i++) {
    if (!A[i]) continue;
    const logA = LOG[A[i]];
    for (let j = 0; j < N; j++) {
      if (!B[j]) continue;
      let e = logA + LOG[B[j]];
      if (e >= BASE_ORDER) e -= BASE_ORDER;
      out[i + j] ^= EXP[e];
    }
  }
  return out;
}

/** Reduce a polynomial in-place modulo q(y) = y¹⁷ + y³ + 1. */
function polyReduce(a: Uint16Array, len: number): void {
  for (let i = len - 1; i > 16; i--) {
    if (!a[i]) continue;
    a[i - 17] ^= a[i];   // y⁰ term of q
    a[i - 14] ^= a[i];   // y³ term of q  (i − 17 + 3)
    a[i] = 0;
  }
}

export function gfMul(a: GFElement, b: GFElement): GFElement {
  const wide = polyMul(a, 17, b, 17);
  polyReduce(wide, wide.length);
  return wide.subarray(0, GF_ELEMENT_SIZE).slice() as GFElement;
}

export function gfMulAssign(a: GFElement, b: GFElement): GFElement {
  const wide = polyMul(a, 17, b, 17);
  polyReduce(wide, wide.length);
  a.set(wide.subarray(0, GF_ELEMENT_SIZE));
  return a;
}

// ─── Squaring ────────────────────────────────────────────────────────────────

export function gfSquare(a: GFElement): GFElement {
  // Squaring a polynomial: (Σ aᵢ yⁱ)² = Σ aᵢ² y²ⁱ  (cross terms vanish in char 2)
  const wide = new Uint16Array(33);
  for (let i = 0; i < 17; i++) wide[2 * i] = baseSqr(a[i]);
  polyReduce(wide, 33);
  return wide.subarray(0, GF_ELEMENT_SIZE).slice() as GFElement;
}

export function gfSquareAssign(a: GFElement): GFElement {
  const sq = gfSquare(a);
  a.set(sq);
  return a;
}

// ─── Inversion (extended Euclidean algorithm) ────────────────────────────────

export function gfInverse(a: GFElement): GFElement {
  if (gfIsZero(a)) throw new RangeError('Zero has no inverse');

  // Extended-GCD approach:
  //   Maintain  F = a, G = q(y),  B = 1, C = 0
  //   with invariant  a·B ≡ F (mod q)  and  a·C ≡ G (mod q).
  //   When F reduces to a constant c, the inverse is B / c.

  const SZ = 34;
  let F = new Uint16Array(SZ), degF = 0;
  let G = new Uint16Array(SZ), degG = 17;
  let B = new Uint16Array(SZ);
  let C = new Uint16Array(SZ);
  let degB = 0, degC = 0;

  for (let i = 0; i < 17; i++) { F[i] = a[i]; if (F[i]) degF = i; }
  G[0] = 1; G[3] = 1; G[17] = 1;
  B[0] = 1;

  /** out += α · src·y^shift, and refresh the tracked degree. */
  const accum = (
    out: Uint16Array, deg: { v: number },
    alpha: number, shift: number,
    src: Uint16Array, srcDeg: number,
  ): void => {
    const la = LOG[alpha];
    for (let i = 0; i <= srcDeg; i++) {
      if (!src[i]) continue;
      let e = la + LOG[src[i]];
      if (e >= BASE_ORDER) e -= BASE_ORDER;
      const pos = i + shift;
      out[pos] ^= EXP[e];
      if (out[pos] && pos > deg.v) deg.v = pos;
    }
    while (deg.v > 0 && !out[deg.v]) deg.v--;
  };

  const wF = { v: degF }, wG = { v: degG }, wB = { v: degB }, wC = { v: degC };
  let pF = F, pG = G, pB = B, pC = C;
  let pWF = wF, pWG = wG, pWB = wB, pWC = wC;

  for (;;) {
    if (pWF.v === 0) {
      // F is a nonzero constant → result = B / F[0]
      const res = gfZero();
      for (let i = 0; i <= pWB.v && i < 17; i++) res[i] = baseDiv(pB[i], pF[0]);
      return res;
    }

    if (pWF.v < pWG.v) {
      [pF, pG] = [pG, pF]; [pB, pC] = [pC, pB];
      [pWF, pWG] = [pWG, pWF]; [pWB, pWC] = [pWC, pWB];
    }

    const shift = pWF.v - pWG.v;
    const alpha = baseDiv(pF[pWF.v], pG[pWG.v]);

    accum(pF, pWF, alpha, shift, pG, pWG.v);
    accum(pB, pWB, alpha, shift, pC, pWC.v);
  }
}

// ─── Division ────────────────────────────────────────────────────────────────

export function gfDiv(a: GFElement, b: GFElement): GFElement {
  return gfMul(a, gfInverse(b));
}

// ─── Serialisation ───────────────────────────────────────────────────────────

/**
 * Pack 17 × 15-bit coefficients into 32 bytes (little-endian bitstream).
 */
export function gfDump(val: GFElement): Uint8Array {
  const out = new Uint8Array(GF_DUMP_SIZE);
  let buf = 0, bits = 0, pos = 0;

  for (let i = 0; i < 17; i++) {
    buf |= val[i] << bits;
    bits += 15;
    while (bits >= 8) {
      out[pos++] = buf & 0xff;
      buf >>>= 8;
      bits -= 8;
    }
  }
  if (bits > 0) out[pos] = buf & 0xff;
  return out;
}

/**
 * Unpack 32 bytes back into a GF element (inverse of gfDump).
 */
export function gfLoad(data: Uint8Array): GFElement {
  if (data.length !== GF_DUMP_SIZE) throw new RangeError(`Expected ${GF_DUMP_SIZE} bytes`);
  if (data[GF_DUMP_SIZE - 1] & 0x80) throw new RangeError('Top bit set — not in GF((2¹⁵)¹⁷)');

  const val = new Uint16Array(GF_ELEMENT_SIZE);
  let buf = 0, bits = 0, bytePos = 0;

  for (let i = 0; i < 17; i++) {
    while (bits < 15 && bytePos < GF_DUMP_SIZE) {
      buf |= data[bytePos++] << bits;
      bits += 8;
    }
    val[i] = buf & 0x7fff;
    buf >>>= 15;
    bits -= 15;
  }
  return val;
}
