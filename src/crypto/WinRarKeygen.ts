/**
 * WinRAR Keygen - core logic.
 * Port of WinRarKeygen<WinRarConfig> from C++ codebase.
 */

import { SHA1 } from "./SHA1";
import { CRC32 } from "./CRC32";
import {
  bigintFromBytes,
  bigintFromUint16LE,
  bigintToHex,
  bigintMod,
  bigintSetBit,
} from "./BigIntUtils";
import { gfDump } from "./GaloisField";
import {
  ecPointMul,
  ecPointDumpCompressed,
} from "./EllipticCurve";
import { G, ORDER, PRIVATE_KEY } from "./WinRarConfig";

export interface RegisterInfo {
  userName: string;
  licenseType: string;
  uid: string;
  items: [string, string, string, string];
  checksum: number;
  hexData: string;
}

// ---- Private Key Generation ----

function generatePrivateKey(seed: Uint8Array | null): bigint {
  const generator = new Uint32Array(6);
  const rawPrivateKey = new Uint16Array(15);

  if (seed && seed.length > 0) {
    const sha1 = new SHA1();
    sha1.update(seed);
    const digest = sha1.evaluate();
    const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    for (let i = 0; i < 5; i++) {
      // C++: BSWAP32(reinterpret_cast<uint32_t*>(Digest)[i]) = BE read = state[i]
      generator[i + 1] = dv.getUint32(i * 4, false); // BE read
    }
  } else {
    generator[1] = 0xeb3eb781;
    generator[2] = 0x50265329;
    generator[3] = 0xdc5ef4a3;
    generator[4] = 0x6847b9d5;
    generator[5] = 0xcde43b4c;
  }

  for (let i = 0; i < 15; i++) {
    const sha1 = new SHA1();
    generator[0] = i + 1;

    // Pass raw bytes of the uint32 array (LE byte order, matching x86/x64 C++)
    sha1.update(new Uint8Array(generator.buffer));
    const digest = sha1.evaluate();

    // C++: BSWAP32(reinterpret_cast<uint32_t*>(Digest)[0]) = BE read = state[0]
    const digestView = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    const val = digestView.getUint32(0, false); // BE read
    rawPrivateKey[i] = val & 0xffff;
  }

  return bigintFromUint16LE(rawPrivateKey);
}

// ---- Public Key Generation ----

function generatePublicKeySM2CompressedFormat(
  message: string,
  encode: (s: string) => Uint8Array = (s) => new TextEncoder().encode(s)
): string {
  const seed = encode(message);
  const privateKey = generatePrivateKey(seed);
  const publicKey = ecPointMul(G, privateKey);
  const compressed = ecPointDumpCompressed(publicKey);

  // compressed = [prefix_byte, ...x_bytes(32)] in BIG-ENDIAN
  // PublicKeyXInteger = BigInt from x_bytes
  const xBytes = compressed.subarray(1);
  let publicKeyXInteger = bigintFromBytes(xBytes, false); // Big-endian

  publicKeyXInteger *= 2n; // 256 bits at most
  if (compressed[0] === 0x03) {
    // LSB(Y/X) == 1
    publicKeyXInteger = bigintSetBit(publicKeyXInteger, 0);
  }

  let hexStr = bigintToHex(publicKeyXInteger);
  // Pad to 64 chars (32 bytes * 2)
  while (hexStr.length < 64) {
    hexStr = "0" + hexStr;
  }

  return hexStr;
}

// ---- Random Integer ----

function generateRandomInteger(): bigint {
  const raw = new Uint16Array(15);
  const cryptoRandom = new Uint8Array(30);
  crypto.getRandomValues(cryptoRandom);
  for (let i = 0; i < 15; i++) {
    raw[i] = (cryptoRandom[i * 2] | (cryptoRandom[i * 2 + 1] << 8)) & 0xffff;
  }
  return bigintFromUint16LE(raw);
}

// ---- Hash Integer ----

function generateHashInteger(message: Uint8Array): bigint {
  const sha1 = new SHA1();
  sha1.update(message);
  const digest = sha1.evaluate();

  const rawHash = new Uint32Array(10);
  const digestView = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);

  for (let i = 0; i < 5; i++) {
    // C++: BSWAP32(reinterpret_cast<uint32_t*>(Digest)[i]) = BE read = state[i]
    rawHash[i] = digestView.getUint32(i * 4, false); // BE read
  }

  // SHA1("") with all-zeroed initial value
  rawHash[5] = 0x0ffd8d43;
  rawHash[6] = 0xb4e33c7c;
  rawHash[7] = 0x53461bd1;
  rawHash[8] = 0x0f27a546;
  rawHash[9] = 0x1050d90d;

  // Take first 240 bits (30 bytes) from the uint32 array in LE byte order
  const fullBytes = new Uint8Array(rawHash.buffer);
  return bigintFromBytes(fullBytes.subarray(0, 30), true);
}

// ---- ECDSA Sign ----

interface ECCSignature {
  r: bigint;
  s: bigint;
}

function sign(data: Uint8Array): ECCSignature {
  const hash = generateHashInteger(data);

  while (true) {
    const random = generateRandomInteger();

    // Calculate r
    const rPoint = ecPointMul(G, random);
    const rXDump = gfDump(rPoint.x);
    let r = bigintFromBytes(rXDump, true);
    r = bigintMod(r + hash, ORDER);

    if (r === 0n || r + random === ORDER) {
      continue;
    }

    // Calculate s
    let s = bigintMod(random - PRIVATE_KEY * r, ORDER);

    if (s === 0n) {
      continue;
    }

    return { r, s };
  }
}

// ---- Checksum ----

function calculateChecksum(
  info: {
    licenseType: string;
    userName: string;
    items: [string, string, string, string];
  },
  encode: (s: string) => Uint8Array = (s) => new TextEncoder().encode(s)
): number {
  const crc = new CRC32();
  crc.update(encode(info.licenseType));
  crc.update(encode(info.userName));
  crc.update(encode(info.items[0]));
  crc.update(encode(info.items[1]));
  crc.update(encode(info.items[2]));
  crc.update(encode(info.items[3]));
  return (~crc.evaluate()) >>> 0;
}

// ---- Main Keygen Function ----

export function generateRegisterInfo(
  userName: string,
  licenseType: string,
  stringToBytes?: (s: string) => Uint8Array
): RegisterInfo {
  const encode = stringToBytes ?? ((s: string) => new TextEncoder().encode(s));
  const items: [string, string, string, string] = ["", "", "", ""];

  let temp = generatePublicKeySM2CompressedFormat(userName, encode);
  items[3] = sprintf("60%.48s", temp);
  items[0] = generatePublicKeySM2CompressedFormat(items[3], encode);
  const uid = sprintf("%.16s%.4s", temp.substring(48), items[0]);

  // Sign license type
  while (true) {
    const ltSig = sign(encode(licenseType));
    let sigR = bigintToHex(ltSig.r);
    let sigS = bigintToHex(ltSig.s);

    while (sigR.length < 60) sigR = "0" + sigR;
    while (sigS.length < 60) sigS = "0" + sigS;

    if (sigR.length === 60 && sigS.length === 60) {
      items[1] = "60" + sigS + sigR;
      break;
    }
  }

  // Sign username + items[0]
  temp = userName + items[0];
  while (true) {
    const unSig = sign(encode(temp));
    let sigR = bigintToHex(unSig.r);
    let sigS = bigintToHex(unSig.s);

    while (sigR.length < 60) sigR = "0" + sigR;
    while (sigS.length < 60) sigS = "0" + sigS;

    if (sigR.length === 60 && sigS.length === 60) {
      items[2] = "60" + sigS + sigR;
      break;
    }
  }

  const checksum = calculateChecksum({ licenseType, userName, items }, encode);

  const hexData = sprintf(
    "%d%d%d%d%s%s%s%s%010d",
    items[0].length,
    items[1].length,
    items[2].length,
    items[3].length,
    items[0],
    items[1],
    items[2],
    items[3],
    checksum
  );

  if (hexData.length % 54 !== 0) {
    throw new Error(
      "InternalError: The length of register data is not correct."
    );
  }

  return {
    userName,
    licenseType,
    uid,
    items,
    checksum,
    hexData,
  };
}

// ---- Helper: sprintf-like formatting ----

function sprintf(format: string, ...args: (string | number)[]): string {
  let result = "";
  let argIdx = 0;
  let i = 0;

  while (i < format.length) {
    if (format[i] === "%" && i + 1 < format.length) {
      i++;
      let width = "";
      let zeroPad = false;
      let precision = -1;

      // Check for zero padding
      if (format[i] === "0") {
        zeroPad = true;
        i++;
      }

      // Parse width
      while (i < format.length && format[i] >= "0" && format[i] <= "9") {
        width += format[i];
        i++;
      }

      // Parse precision
      if (i < format.length && format[i] === ".") {
        i++;
        let precStr = "";
        while (i < format.length && format[i] >= "0" && format[i] <= "9") {
          precStr += format[i];
          i++;
        }
        precision = parseInt(precStr, 10);
      }

      if (i < format.length) {
        const spec = format[i];
        i++;

        if (spec === "s") {
          let s = String(args[argIdx++]);
          if (precision >= 0) {
            s = s.substring(0, precision);
          }
          result += s;
        } else if (spec === "d" || spec === "u") {
          let numStr = String(Math.abs(Number(args[argIdx++])));
          const w = parseInt(width, 10) || 0;
          while (numStr.length < w) {
            numStr = (zeroPad ? "0" : " ") + numStr;
          }
          result += numStr;
        } else if (spec === "l") {
          // %lu - unsigned long
          if (i < format.length && format[i] === "u") {
            i++;
            let numStr = String(Number(args[argIdx++]) >>> 0);
            const w = parseInt(width, 10) || 0;
            while (numStr.length < w) {
              numStr = (zeroPad ? "0" : " ") + numStr;
            }
            result += numStr;
          }
        } else if (spec === "z") {
          // %zu - size_t
          if (i < format.length && format[i] === "u") {
            i++;
            result += String(args[argIdx++]);
          }
        } else {
          result += spec;
        }
      }
    } else {
      result += format[i];
      i++;
    }
  }

  return result;
}

// ---- Build registration file content ----

export function buildRegFileContent(info: RegisterInfo): string {
  let s = "RAR registration data\r\n";
  s += info.userName + "\r\n";
  s += info.licenseType + "\r\n";
  s += "UID=" + info.uid + "\r\n";
  for (let i = 0; i < info.hexData.length; i += 54) {
    s += info.hexData.substring(i, i + 54) + "\r\n";
  }
  return s;
}
