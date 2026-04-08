/**
 * Utility functions for BigInt <-> byte array conversions.
 * Replaces GMP's mpz_import / mpz_export functionality.
 */

/**
 * Import a BigInt from a byte array.
 * @param data - Uint8Array of bytes
 * @param littleEndian - if true, first byte is least significant
 * @returns BigInt value (always non-negative)
 */
export function bigintFromBytes(
  data: Uint8Array,
  littleEndian: boolean
): bigint {
  let result = 0n;
  if (littleEndian) {
    for (let i = data.length - 1; i >= 0; i--) {
      result = (result << 8n) | BigInt(data[i]);
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      result = (result << 8n) | BigInt(data[i]);
    }
  }
  return result;
}

/**
 * Export a BigInt to a byte array.
 * @param value - non-negative BigInt
 * @param length - desired output length in bytes (zero-padded)
 * @param littleEndian - if true, first byte is least significant
 * @returns Uint8Array
 */
export function bigintToBytes(
  value: bigint,
  length: number,
  littleEndian: boolean
): Uint8Array {
  if (value < 0n) {
    throw new Error("bigintToBytes: negative values not supported");
  }
  const result = new Uint8Array(length);
  let v = value;
  if (littleEndian) {
    for (let i = 0; i < length; i++) {
      result[i] = Number(v & 0xffn);
      v >>= 8n;
    }
  } else {
    for (let i = length - 1; i >= 0; i--) {
      result[i] = Number(v & 0xffn);
      v >>= 8n;
    }
  }
  return result;
}

/**
 * Import a BigInt from a Uint16Array (little-endian words).
 * Each element is a 16-bit word, word[0] is least significant.
 */
export function bigintFromUint16LE(data: Uint16Array): bigint {
  let result = 0n;
  for (let i = data.length - 1; i >= 0; i--) {
    result = (result << 16n) | BigInt(data[i]);
  }
  return result;
}

/**
 * BSWAP32 equivalent: reverse bytes of a 32-bit integer
 */
export function bswap32(x: number): number {
  return (
    (((x & 0xff) << 24) |
      ((x & 0xff00) << 8) |
      ((x & 0xff0000) >>> 8) |
      ((x & 0xff000000) >>> 24)) >>>
    0
  );
}

/**
 * Convert SHA-1 digest (20 bytes big-endian) to array of 5 uint32
 * with byte-swap (matching the C++ BSWAP32 pattern).
 */
export function sha1DigestToUint32Swapped(digest: Uint8Array): Uint32Array {
  const view = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
  const result = new Uint32Array(5);
  for (let i = 0; i < 5; i++) {
    // Read as big-endian (which is SHA-1's native output), then bswap.
    // bswap of big-endian read = little-endian read
    result[i] = view.getUint32(i * 4, true); // read little-endian
  }
  return result;
}

/**
 * Get the bit length of a BigInt
 */
export function bigintBitLength(value: bigint): number {
  if (value === 0n) return 0;
  let v = value < 0n ? -value : value;
  let bits = 0;
  while (v > 0n) {
    bits++;
    v >>= 1n;
  }
  return bits;
}

/**
 * Set a specific bit of a BigInt
 */
export function bigintSetBit(value: bigint, bit: number): bigint {
  return value | (1n << BigInt(bit));
}

/**
 * Test a specific bit of a BigInt
 */
export function bigintTestBit(value: bigint, bit: number): boolean {
  return (value & (1n << BigInt(bit))) !== 0n;
}

/**
 * Modular operation that always returns non-negative result (like GMP's mpz_fdiv_r)
 */
export function bigintMod(a: bigint, m: bigint): bigint {
  const r = a % m;
  return r < 0n ? r + m : r;
}

/**
 * Convert a BigInt to hex string (lowercase), without '0x' prefix.
 */
export function bigintToHex(value: bigint): string {
  if (value < 0n) {
    throw new Error("bigintToHex: negative values not supported");
  }
  if (value === 0n) return "0";
  return value.toString(16);
}
