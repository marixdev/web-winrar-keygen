/**
 * Pure TypeScript SHA-1 implementation.
 *
 * NOTE: This implementation uses a ZEROED initial state (all zeros)
 * instead of the standard SHA-1 constants {0x67452301, 0xEFCDAB89, ...}.
 * WinRAR keygen intentionally uses an all-zero initial state.
 */

function rotateLeft(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function processBlock(state: Uint32Array, block: Uint8Array): void {
  const w = new Uint32Array(80);

  for (let i = 0; i < 16; i++) {
    w[i] =
      ((block[i * 4] << 24) |
        (block[i * 4 + 1] << 16) |
        (block[i * 4 + 2] << 8) |
        block[i * 4 + 3]) >>>
      0;
  }
  for (let i = 16; i < 80; i++) {
    w[i] = rotateLeft((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 0, 1);
  }

  let a = state[0],
    b = state[1],
    c = state[2],
    d = state[3],
    e = state[4];

  for (let i = 0; i < 80; i++) {
    let f: number, k: number;
    if (i < 20) {
      f = ((b & c) | (~b & d)) >>> 0;
      k = 0x5a827999;
    } else if (i < 40) {
      f = (b ^ c ^ d) >>> 0;
      k = 0x6ed9eba1;
    } else if (i < 60) {
      f = ((b & c) | (b & d) | (c & d)) >>> 0;
      k = 0x8f1bbcdc;
    } else {
      f = (b ^ c ^ d) >>> 0;
      k = 0xca62c1d6;
    }

    const temp = (rotateLeft(a, 5) + f + e + k + w[i]) >>> 0;
    e = d;
    d = c;
    c = rotateLeft(b, 30);
    b = a;
    a = temp;
  }

  state[0] = (state[0] + a) >>> 0;
  state[1] = (state[1] + b) >>> 0;
  state[2] = (state[2] + c) >>> 0;
  state[3] = (state[3] + d) >>> 0;
  state[4] = (state[4] + e) >>> 0;
}

export class SHA1 {
  private state: Uint32Array;
  private count: number = 0;
  private buffer: Uint8Array = new Uint8Array(64);

  constructor() {
    // Standard SHA-1 initial values
    this.state = new Uint32Array([
      0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0,
    ]);
  }

  update(data: Uint8Array): void {
    let offset = 0;
    const bufferIndex = this.count % 64;
    this.count += data.length;

    let remaining = data.length;
    let bufIdx = bufferIndex;

    if (bufIdx > 0) {
      const toCopy = Math.min(64 - bufIdx, remaining);
      this.buffer.set(data.subarray(0, toCopy), bufIdx);
      bufIdx += toCopy;
      offset += toCopy;
      remaining -= toCopy;
      if (bufIdx === 64) {
        processBlock(this.state, this.buffer);
        bufIdx = 0;
      }
    }

    while (remaining >= 64) {
      processBlock(this.state, data.subarray(offset, offset + 64));
      offset += 64;
      remaining -= 64;
    }

    if (remaining > 0) {
      this.buffer.set(data.subarray(offset), 0);
    }
  }

  updateFromBuffer(buffer: ArrayBuffer): void {
    this.update(new Uint8Array(buffer));
  }

  evaluate(): Uint8Array {
    // Clone state so evaluate can be called multiple times
    const stateCopy = new Uint32Array(this.state);
    const countCopy = this.count;

    const bufferIndex = countCopy % 64;
    const padBuffer = new Uint8Array(64);

    // Copy remaining bytes
    padBuffer.set(this.buffer.subarray(0, bufferIndex));
    padBuffer[bufferIndex] = 0x80;

    if (bufferIndex >= 56) {
      // Need two blocks
      processBlock(stateCopy, padBuffer);
      padBuffer.fill(0);
    }

    // Append length in bits as big-endian 64-bit
    const bitLength = countCopy * 8;
    const view = new DataView(padBuffer.buffer);
    // High 32 bits (for messages < 2^32 bytes, this handles up to ~512MB)
    view.setUint32(56, Math.floor(bitLength / 0x100000000) >>> 0, false);
    view.setUint32(60, (bitLength & 0xffffffff) >>> 0, false);

    processBlock(stateCopy, padBuffer);

    // Output digest as big-endian bytes
    const digest = new Uint8Array(20);
    const dv = new DataView(digest.buffer);
    for (let i = 0; i < 5; i++) {
      dv.setUint32(i * 4, stateCopy[i], false);
    }

    return digest;
  }
}
