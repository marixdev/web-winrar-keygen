/**
 * SHA-1 hash implementation (FIPS PUB 180-4).
 *
 * Provides a streaming interface: create, update with bytes or strings,
 * then evaluate to obtain the 20-byte digest.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const IV: readonly number[] = [
  0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
];

// ─── 32-bit helpers ──────────────────────────────────────────────────────────

function rotl32(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function toU32(x: number): number {
  return x >>> 0;
}

// ─── Block processing ────────────────────────────────────────────────────────

function processBlock(state: Uint32Array, block: DataView, offset: number): void {
  const W = new Uint32Array(80);

  for (let t = 0; t < 16; t++) {
    W[t] = block.getUint32(offset + t * 4, false);  // big-endian
  }
  for (let t = 16; t < 80; t++) {
    W[t] = rotl32(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
  }

  let [a, b, c, d, e] = state;

  for (let t = 0; t < 80; t++) {
    let f: number, K: number;
    if (t < 20) {
      f = (b & c) | (~b & d);
      K = 0x5a827999;
    } else if (t < 40) {
      f = b ^ c ^ d;
      K = 0x6ed9eba1;
    } else if (t < 60) {
      f = (b & c) | (b & d) | (c & d);
      K = 0x8f1bbcdc;
    } else {
      f = b ^ c ^ d;
      K = 0xca62c1d6;
    }

    const temp = toU32(rotl32(a, 5) + toU32(f) + e + K + W[t]);
    e = d; d = c; c = rotl32(b, 30); b = a; a = temp;
  }

  state[0] = toU32(state[0] + a);
  state[1] = toU32(state[1] + b);
  state[2] = toU32(state[2] + c);
  state[3] = toU32(state[3] + d);
  state[4] = toU32(state[4] + e);
}

// ─── SHA1 hasher ─────────────────────────────────────────────────────────────

export class SHA1 {
  private state = new Uint32Array(IV);
  private buffer = new Uint8Array(64);
  private bufLen = 0;
  private totalLen = 0;      // in bytes (max 2^53 − 1 is fine for JS)

  /** Feed raw bytes into the hash. */
  update(data: Uint8Array): this {
    let off = 0;
    this.totalLen += data.length;

    // Fill the partial block first
    if (this.bufLen > 0) {
      const need = 64 - this.bufLen;
      const take = Math.min(need, data.length);
      this.buffer.set(data.subarray(0, take), this.bufLen);
      this.bufLen += take;
      off += take;
      if (this.bufLen === 64) {
        processBlock(this.state, new DataView(this.buffer.buffer), 0);
        this.bufLen = 0;
      }
    }

    // Process whole 64-byte blocks directly from the input
    while (off + 64 <= data.length) {
      // Copy to aligned buffer to guarantee DataView alignment
      this.buffer.set(data.subarray(off, off + 64));
      processBlock(this.state, new DataView(this.buffer.buffer), 0);
      off += 64;
    }

    // Stash leftovers
    if (off < data.length) {
      this.buffer.set(data.subarray(off), 0);
      this.bufLen = data.length - off;
    }

    return this;
  }

  /** Convenience: feed a UTF-8 string. */
  updateString(s: string): this {
    return this.update(new TextEncoder().encode(s));
  }

  /** Finalise and return the 20-byte digest. Does NOT mutate the hasher. */
  evaluate(): Uint8Array {
    // Clone state so we can call evaluate() repeatedly
    const st = new Uint32Array(this.state);
    const buf = new Uint8Array(64);
    buf.set(this.buffer.subarray(0, this.bufLen));
    let pos = this.bufLen;

    // Padding: append 0x80
    buf[pos++] = 0x80;

    if (pos > 56) {
      // Not enough room for the 8-byte length → pad this block, process, start new
      buf.fill(0, pos, 64);
      processBlock(st, new DataView(buf.buffer), 0);
      buf.fill(0, 0, 56);
    } else {
      buf.fill(0, pos, 56);
    }

    // Append bit-length as 64-bit big-endian
    const bitLen = this.totalLen * 8;
    const dv = new DataView(buf.buffer);
    dv.setUint32(56, Math.floor(bitLen / 0x100000000), false);
    dv.setUint32(60, bitLen >>> 0, false);
    processBlock(st, dv, 0);

    // Serialise 5 × 32-bit words → 20 bytes big-endian
    const digest = new Uint8Array(20);
    const out = new DataView(digest.buffer);
    for (let i = 0; i < 5; i++) out.setUint32(i * 4, st[i], false);
    return digest;
  }

  /** Reset the hasher for reuse. */
  reset(): this {
    this.state.set(IV);
    this.bufLen = 0;
    this.totalLen = 0;
    return this;
  }
}
