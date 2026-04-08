/**
 * CRC32 implementation with configurable polynomial.
 */

const POLYNOMIAL = 0xEDB88320;

// Build lookup table
const crc32Table: Uint32Array = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let result = i;
  for (let j = 0; j < 8; j++) {
    if (result & 1) {
      result = (result >>> 1) ^ POLYNOMIAL;
    } else {
      result = result >>> 1;
    }
  }
  crc32Table[i] = result;
}

export class CRC32 {
  private value: number = 0;

  update(data: Uint8Array): void {
    let crc = ~this.value >>> 0;
    for (let i = 0; i < data.length; i++) {
      crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xff];
    }
    this.value = (~crc) >>> 0;
  }

  updateString(str: string): void {
    const encoder = new TextEncoder();
    this.update(encoder.encode(str));
  }

  evaluate(): number {
    return this.value;
  }

  reset(): void {
    this.value = 0;
  }
}
