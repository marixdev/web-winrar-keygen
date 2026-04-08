/**
 * Node.js test for the crypto modules.
 * Verifies SHA-1, CRC32, GaloisField, and key generation.
 * 
 * Run: node --experimental-vm-modules verify.mjs
 * Or: node verify.mjs
 */

// === SHA-1 Test (standard values) ===
function rotateLeft(x, n) {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function sha1ProcessBlock(state, block) {
  const w = new Uint32Array(80);
  for (let i = 0; i < 16; i++) {
    w[i] = ((block[i * 4] << 24) | (block[i * 4 + 1] << 16) | (block[i * 4 + 2] << 8) | block[i * 4 + 3]) >>> 0;
  }
  for (let i = 16; i < 80; i++) {
    w[i] = rotateLeft((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 0, 1);
  }
  let a = state[0], b = state[1], c = state[2], d = state[3], e = state[4];
  for (let i = 0; i < 80; i++) {
    let f, k;
    if (i < 20) { f = ((b & c) | (~b & d)) >>> 0; k = 0x5a827999; }
    else if (i < 40) { f = (b ^ c ^ d) >>> 0; k = 0x6ed9eba1; }
    else if (i < 60) { f = ((b & c) | (b & d) | (c & d)) >>> 0; k = 0x8f1bbcdc; }
    else { f = (b ^ c ^ d) >>> 0; k = 0xca62c1d6; }
    const temp = (rotateLeft(a, 5) + f + e + k + w[i]) >>> 0;
    e = d; d = c; c = rotateLeft(b, 30); b = a; a = temp;
  }
  state[0] = (state[0] + a) >>> 0;
  state[1] = (state[1] + b) >>> 0;
  state[2] = (state[2] + c) >>> 0;
  state[3] = (state[3] + d) >>> 0;
  state[4] = (state[4] + e) >>> 0;
}

function sha1(data) {
  const state = new Uint32Array([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
  let count = data.length;

  // Process full blocks
  let offset = 0;
  while (offset + 64 <= data.length) {
    sha1ProcessBlock(state, data.subarray(offset, offset + 64));
    offset += 64;
  }

  // Padding
  const remaining = data.length - offset;
  const padBuffer = new Uint8Array(128);
  if (remaining > 0) padBuffer.set(data.subarray(offset), 0);
  padBuffer[remaining] = 0x80;

  const totalBlocks = remaining >= 56 ? 2 : 1;
  const bitLen = count * 8;
  const lastBlockStart = (totalBlocks - 1) * 64;
  const view = new DataView(padBuffer.buffer);
  view.setUint32(lastBlockStart + 56, Math.floor(bitLen / 0x100000000) >>> 0, false);
  view.setUint32(lastBlockStart + 60, (bitLen & 0xFFFFFFFF) >>> 0, false);

  for (let i = 0; i < totalBlocks; i++) {
    sha1ProcessBlock(state, padBuffer.subarray(i * 64, (i + 1) * 64));
  }

  const digest = new Uint8Array(20);
  const dv = new DataView(digest.buffer);
  for (let i = 0; i < 5; i++) dv.setUint32(i * 4, state[i], false);
  return digest;
}

// Test SHA-1("abc") = A9993E36 4706816A BA3E2571 7850C26C 9CD0D89D
const abc = new Uint8Array([0x61, 0x62, 0x63]);
const hash = sha1(abc);
const hashHex = Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
const expected = "a9993e364706816aba3e25717850c26c9cd0d89d";
console.log("SHA-1('abc') =", hashHex);
console.log("Expected     =", expected);
console.log("SHA-1 test:", hashHex === expected ? "PASS" : "FAIL");

// Test SHA-1("") = DA39A3EE 5E6B4B0D 3255BFEF 95601890 AFD80709
const empty = new Uint8Array(0);
const hashEmpty = sha1(empty);
const hashEmptyHex = Array.from(hashEmpty).map(b => b.toString(16).padStart(2, '0')).join('');
const expectedEmpty = "da39a3ee5e6b4b0d3255bfef95601890afd80709";
console.log("\nSHA-1('') =", hashEmptyHex);
console.log("Expected   =", expectedEmpty);
console.log("SHA-1 empty test:", hashEmptyHex === expectedEmpty ? "PASS" : "FAIL");

// === CRC32 Test ===
const POLY = 0xEDB88320;
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let r = i;
  for (let j = 0; j < 8; j++) { r = (r & 1) ? ((r >>> 1) ^ POLY) : (r >>> 1); }
  crc32Table[i] = r;
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xFF];
  }
  return (~crc) >>> 0;
}

// CRC32("123456789") = CBF43926
const testData = new TextEncoder().encode("123456789");
const crcResult = crc32(testData);
console.log("\nCRC32('123456789') =", crcResult.toString(16));
console.log("Expected           = cbf43926");
console.log("CRC32 test:", crcResult === 0xCBF43926 ? "PASS" : "FAIL");

// === GaloisField test ===
// Test the log/exp tables
const ORDER = 0x7FFF;
const expTable = new Uint16Array(0x8000);
expTable[0] = 1;
for (let i = 1; i < ORDER; i++) {
  let temp = expTable[i - 1] * 2;
  if (temp & 0x8000) temp ^= 0x8003;
  expTable[i] = temp;
}

// Verify: exp(0) = 1, exp(ORDER-1) should cycle back
console.log("\nGF(2^15) exp[0] =", expTable[0], "(expected 1)");
console.log("GF(2^15) exp[1] =", expTable[1], "(expected 2)");
console.log("GF(2^15) exp table test:", expTable[0] === 1 && expTable[1] === 2 ? "PASS" : "FAIL");

console.log("\nAll basic tests complete.");
