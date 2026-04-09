/**
 * BigInt ↔ byte-array conversion utilities.
 *
 * All functions work with unsigned big-endian or little-endian byte arrays
 * and native ES2020 BigInt.
 */

/** Convert a byte array (big-endian) to a non-negative BigInt. */
export function bigintFromBytes(bytes: Uint8Array): bigint {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  return n;
}

/** Convert a non-negative BigInt to a big-endian byte array of `length` bytes. */
export function bigintToBytes(n: bigint, length: number): Uint8Array {
  const out = new Uint8Array(length);
  let v = n;
  for (let i = length - 1; i >= 0; i--) {
    out[i] = Number(v & 0xffn);
    v >>= 8n;
  }
  return out;
}

/**
 * Interpret an array of uint16 values as a little-endian base-65536 number.
 * i.e. result = Σ items[i] · 2^{16i}
 */
export function bigintFromUint16LE(items: ArrayLike<number>, count: number): bigint {
  let n = 0n;
  for (let i = count - 1; i >= 0; i--) {
    n = (n << 16n) | BigInt(items[i] & 0xffff);
  }
  return n;
}

/** Number of significant bits in a BigInt (0n → 0). */
export function bigintBitLength(n: bigint): number {
  if (n <= 0n) return 0;
  // toString(2) is the simplest portable approach
  return n.toString(2).length;
}

/** Set bit `idx` (0-based from LSB) of BigInt `n`. */
export function bigintSetBit(n: bigint, idx: number): bigint {
  return n | (1n << BigInt(idx));
}

/** Test whether bit `idx` (0-based from LSB) is set. */
export function bigintTestBit(n: bigint, idx: number): boolean {
  return ((n >> BigInt(idx)) & 1n) === 1n;
}

/** Non-negative modulus (always returns a value in [0, m)). */
export function bigintMod(a: bigint, m: bigint): bigint {
  const r = a % m;
  return r < 0n ? r + m : r;
}

/** Convert a BigInt to a zero-padded hex string of `digits` characters. */
export function bigintToHex(n: bigint, digits: number): string {
  return n.toString(16).padStart(digits, '0');
}
