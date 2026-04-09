/**
 * WinRAR keygen — key generation and registration-file formatting.
 *
 * Public API consumed by the UI:
 *   - RegisterInfo         (type)
 *   - generateRegisterInfo (main entry point)
 *   - buildRegFileContent  (formats the .key file text)
 */

import { SHA1 } from './SHA1';
import { CRC32 } from './CRC32';
import { gfDump } from './GaloisField';
import { ecPointMul, ecPointDumpCompressed } from './EllipticCurve';
import { CURVE, G, ORDER, PRIVATE_KEY } from './WinRarConfig';
import {
  bigintFromBytes,
  bigintFromUint16LE,
  bigintSetBit,
  bigintMod,
  bigintToHex,
} from './BigIntUtils';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RegisterInfo {
  userName: string;
  licenseType: string;
  uid: string;
  items: [string, string, string, string];
  checksum: number;
  hexData: string;
}

// ─── Internal: private-key derivation ────────────────────────────────────────

/**
 * Derive a 240-bit private key from an optional seed.
 *
 * When seed is null the hardcoded generator constants are used (producing
 * the canonical WinRAR private key).  When a seed is provided the generator
 * is seeded by SHA-1(seed).
 *
 * Algorithm:
 *   1. Set generator[1..5] from either the hardcoded values or SHA-1(seed).
 *   2. For i in 0..14:
 *        generator[0] = i + 1
 *        digest = SHA-1(generator as 24 raw bytes, big-endian)
 *        rawKey[i] = first 2 bytes of digest interpreted as uint32 BE, kept as uint16
 *   3. Interpret the 15 × uint16 array as a 240-bit LE integer.
 */
function derivePrivateKey(seed: Uint8Array | null): bigint {
  const gen = new Uint32Array(6);

  if (seed !== null && seed.length > 0) {
    const digest = new SHA1().update(seed).evaluate();
    const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    for (let i = 0; i < 5; i++) gen[i + 1] = dv.getUint32(i * 4, false);
  } else {
    gen[1] = 0xeb3eb781;
    gen[2] = 0x50265329;
    gen[3] = 0xdc5ef4a3;
    gen[4] = 0x6847b9d5;
    gen[5] = 0xcde43b4c;
  }

  const rawKey = new Uint16Array(15);

  for (let i = 0; i < 15; i++) {
    gen[0] = i + 1;

    // Serialise generator[] as 24 bytes, each uint32 in little-endian
    // (must match C++ native x86 memory layout fed to SHA-1)
    const buf = new Uint8Array(24);
    const bv = new DataView(buf.buffer);
    for (let j = 0; j < 6; j++) bv.setUint32(j * 4, gen[j], true);

    const digest = new SHA1().update(buf).evaluate();
    const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    rawKey[i] = dv.getUint32(0, false) & 0xffff;   // keep low 16 bits of first BE uint32
  }

  // Interpret 15 × uint16 as a little-endian 240-bit integer
  return bigintFromUint16LE(rawKey, 15);
}

// ─── Internal: compressed public key in hex ──────────────────────────────────

/**
 * Compute a compressed public-key hex string (64 hex chars).
 *
 * 1. privateKey  = derivePrivateKey(encode(message))
 * 2. publicKey   = G × privateKey
 * 3. compressed  = prefix (1 byte) + x (32 bytes)
 * 4. xInteger    = bigint(x, BE) × 2;  if prefix == 0x03 → set bit 0
 * 5. Return as 64-char lowercase hex.
 */
function compressedPublicKeyHex(message: string, encode: (s: string) => Uint8Array): string {
  const key = derivePrivateKey(encode(message));
  const pub = ecPointMul(CURVE, G, key);
  const comp = ecPointDumpCompressed(pub);

  // comp[0] = prefix (0x02 or 0x03), comp[1..32] = x coordinate
  let xInt = bigintFromBytes(comp.subarray(1));
  xInt *= 2n;
  if (comp[0] === 0x03) xInt = bigintSetBit(xInt, 0);

  return bigintToHex(xInt, 64);
}

// ─── Internal: hash integer ──────────────────────────────────────────────────

/**
 * Generate a 240-bit hash integer from raw message bytes.
 *
 * 1. SHA-1(message) → 5 × uint32 (big-endian)
 * 2. Append 5 fixed uint32 constants
 * 3. Interpret first 30 bytes (= 15 × uint16) as LE integer
 */
function hashInteger(data: Uint8Array): bigint {
  const digest = new SHA1().update(data).evaluate();
  const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);

  const raw = new Uint32Array(10);
  for (let i = 0; i < 5; i++) raw[i] = dv.getUint32(i * 4, false);

  // Fixed tail constants (SHA-1 of empty string with zeroed IV)
  raw[5] = 0x0ffd8d43;
  raw[6] = 0xb4e33c7c;
  raw[7] = 0x53461bd1;
  raw[8] = 0x0f27a546;
  raw[9] = 0x1050d90d;

  // Reinterpret as uint16 LE array, take first 15 (= 240 bits)
  const u16 = new Uint16Array(raw.buffer, 0, 15);
  return bigintFromUint16LE(u16, 15);
}

// ─── Internal: ECDSA-variant signing ─────────────────────────────────────────

interface Signature {
  r: bigint;
  s: bigint;
}

function sign(data: Uint8Array): Signature {
  const hash = hashInteger(data);

  for (;;) {
    // Generate 240-bit random integer (15 × random uint16)
    const rndBuf = new Uint8Array(30);
    crypto.getRandomValues(rndBuf);
    const u16 = new Uint16Array(15);
    const rdv = new DataView(rndBuf.buffer);
    for (let i = 0; i < 15; i++) u16[i] = rdv.getUint16(i * 2, true);
    const random = bigintFromUint16LE(u16, 15);

    // r = (x-coord of G×random  as LE integer) + hash   (mod ORDER)
    const Rpoint = ecPointMul(CURVE, G, random);
    const xBytes = gfDump(Rpoint.x);                         // 32 bytes LE
    const xInt   = bigintFromUint16LE(new Uint16Array(xBytes.buffer, xBytes.byteOffset, 16), 16);
    let r = bigintMod(xInt + hash, ORDER);
    if (r === 0n || r + random === ORDER) continue;

    // s = (random − PRIVATE_KEY × r) mod ORDER
    let s = bigintMod(random - PRIVATE_KEY * r, ORDER);
    if (s === 0n) continue;

    return { r, s };
  }
}

// ─── Internal: CRC-32 checksum ───────────────────────────────────────────────

function calcChecksum(
  licenseType: string,
  userName: string,
  items: [string, string, string, string],
): number {
  const crc = new CRC32();
  crc.updateString(licenseType);
  crc.updateString(userName);
  for (const item of items) crc.updateString(item);
  return (~crc.evaluate()) >>> 0;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate a complete WinRAR registration blob.
 *
 * @param userName    - Display name (already preprocessed by Encoding module)
 * @param licenseType - e.g. "Single PC usage license"
 * @param encode      - Function that converts a JS string to the bytes
 *                      WinRAR would see (UTF-8 or Windows-1252).
 */
export function generateRegisterInfo(
  userName: string,
  licenseType: string,
  encode: (s: string) => Uint8Array,
): RegisterInfo {
  // First public-key compression (keyed on userName)
  const temp = compressedPublicKeyHex(userName, encode);

  const items: [string, string, string, string] = ['', '', '', ''];
  items[3] = '60' + temp.substring(0, 48);

  // Second compression (keyed on items[3])
  items[0] = compressedPublicKeyHex(items[3], encode);

  const uid = temp.substring(48) + items[0].substring(0, 4);  // 16 + 4 = 20

  // Sign license type
  for (;;) {
    const sig = sign(encode(licenseType));
    const hexS = bigintToHex(sig.s, 60);
    const hexR = bigintToHex(sig.r, 60);
    if (hexS.length === 60 && hexR.length === 60) {
      items[1] = '60' + hexS + hexR;
      break;
    }
  }

  // Sign (userName + items[0])
  for (;;) {
    const sig = sign(encode(userName + items[0]));
    const hexS = bigintToHex(sig.s, 60);
    const hexR = bigintToHex(sig.r, 60);
    if (hexS.length === 60 && hexR.length === 60) {
      items[2] = '60' + hexS + hexR;
      break;
    }
  }

  const checksum = calcChecksum(licenseType, userName, items);

  // Build hex data line:  <4 lengths><4 items><10-digit checksum>
  const hexData =
    `${items[0].length}${items[1].length}${items[2].length}${items[3].length}` +
    items.join('') +
    checksum.toString(10).padStart(10, '0');

  if (hexData.length % 54 !== 0) {
    throw new Error('Internal error: hex data length is not a multiple of 54.');
  }

  return { userName, licenseType, uid, items, checksum, hexData };
}

/**
 * Format the text content of a rarreg.key file.
 */
export function buildRegFileContent(info: RegisterInfo): string {
  const lines: string[] = [];
  lines.push('RAR registration data');
  lines.push(info.userName);
  lines.push(info.licenseType);
  lines.push(`UID=${info.uid}`);

  // Split hexData into 54-char lines
  for (let i = 0; i < info.hexData.length; i += 54) {
    lines.push(info.hexData.substring(i, i + 54));
  }

  return lines.join('\r\n') + '\r\n';
}
