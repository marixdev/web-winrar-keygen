/**
 * CRC-32 with the standard reflected polynomial 0xEDB88320.
 *
 * Provides both a stateful class (for incremental updates) and a
 * one-shot `crc32` function.
 */

// ─── Lookup table (256 entries, computed once) ───────────────────────────────

const TABLE = new Uint32Array(256);
{
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    TABLE[i] = c >>> 0;
  }
}

// ─── Streaming class ─────────────────────────────────────────────────────────

export class CRC32 {
  private crc = 0xffffffff;

  /** Feed raw bytes. */
  update(data: Uint8Array): this {
    let c = this.crc;
    for (let i = 0; i < data.length; i++) {
      c = TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
    }
    this.crc = c >>> 0;
    return this;
  }

  /** Feed a UTF-8 encoded string. */
  updateString(s: string): this {
    return this.update(new TextEncoder().encode(s));
  }

  /** Return the finalised CRC-32 value. */
  evaluate(): number {
    return (this.crc ^ 0xffffffff) >>> 0;
  }

  /** Reset for reuse. */
  reset(): this {
    this.crc = 0xffffffff;
    return this;
  }
}

// ─── One-shot helper ─────────────────────────────────────────────────────────

/** Compute CRC-32 of a byte array in one call. */
export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}
