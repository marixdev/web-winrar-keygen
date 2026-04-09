/**
 * RAR4-format archive builder.
 *
 * Creates a minimal valid .rar file containing a single stored (uncompressed)
 * file.  Used to package rarreg.key for convenient download.
 */

import { crc32 } from './CRC32';

// ─── RAR constants ───────────────────────────────────────────────────────────

/** RAR 4.x signature (7 bytes). */
const RAR_SIGNATURE = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00]);

/** Block types. */
const BLOCK_ARCHIVE = 0x73;
const BLOCK_FILE    = 0x74;
const BLOCK_END     = 0x7b;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Write a uint16 LE into buf at offset. */
function put16(buf: Uint8Array, off: number, val: number): void {
  buf[off]     = val & 0xff;
  buf[off + 1] = (val >>> 8) & 0xff;
}

/** Write a uint32 LE into buf at offset. */
function put32(buf: Uint8Array, off: number, val: number): void {
  buf[off]     = val & 0xff;
  buf[off + 1] = (val >>> 8) & 0xff;
  buf[off + 2] = (val >>> 16) & 0xff;
  buf[off + 3] = (val >>> 24) & 0xff;
}

/**
 * Compute the header CRC-16 used in RAR blocks.
 * It is just the low 16 bits of CRC-32 over the header bytes starting
 * after the 2-byte CRC field itself.
 */
function headerCrc16(header: Uint8Array, start: number): number {
  return crc32(header.subarray(start)) & 0xffff;
}

// ─── Build archive ───────────────────────────────────────────────────────────

/**
 * Build a RAR4 archive containing one stored file.
 *
 * @param fileName  Name of the file inside the archive (ASCII).
 * @param fileData  Raw content of the file.
 * @returns         Complete .rar file as Uint8Array.
 */
export function buildRar4Archive(fileName: string, fileData: Uint8Array): Uint8Array {
  const nameBytes = new TextEncoder().encode(fileName);
  const dataLen   = fileData.length;
  const dataCrc   = crc32(fileData);

  // ── Marker block (7 bytes) ──
  // The RAR marker block IS the signature bytes.  In practice the signature
  // already serves this purpose so we just prepend it.

  // ── Archive header block ──
  // SIZE = 7 bytes (HEAD_CRC 2 + HEAD_TYPE 1 + HEAD_FLAGS 2 + HEAD_SIZE 2)
  const archHdr = new Uint8Array(7);
  archHdr[2] = BLOCK_ARCHIVE;
  put16(archHdr, 3, 0x0000);         // flags
  put16(archHdr, 5, 7);              // header size
  put16(archHdr, 0, headerCrc16(archHdr, 2));

  // ── File header block ──
  // Base header = 32 + nameBytes.length
  const fileHdrSize = 32 + nameBytes.length;
  const fileHdr = new Uint8Array(fileHdrSize);

  fileHdr[2] = BLOCK_FILE;
  // flags: 0x8000 = ADD_SIZE flag (header is followed by file data)
  put16(fileHdr, 3, 0x8000);
  put16(fileHdr, 5, fileHdrSize);     // header size

  put32(fileHdr, 7, dataLen);          // compressed size (= uncompressed, stored)
  put32(fileHdr, 11, dataLen);         // uncompressed size

  fileHdr[15] = 0x20;                 // HOST_OS = Win32
  put32(fileHdr, 16, dataCrc);         // FILE_CRC
  put32(fileHdr, 20, 0);              // FTIME (unused)

  fileHdr[24] = 20;                   // UNPACK_VER = 2.0
  fileHdr[25] = 0x30;                 // METHOD = storing (0x30)

  put16(fileHdr, 26, nameBytes.length);   // NAME_SIZE
  put32(fileHdr, 28, 0x20);           // ATTR = Archive attribute

  fileHdr.set(nameBytes, 32);

  put16(fileHdr, 0, headerCrc16(fileHdr, 2));

  // ── End-of-archive block ──
  const endHdr = new Uint8Array(7);
  endHdr[2] = BLOCK_END;
  put16(endHdr, 3, 0x4000);          // flags: ENDARC_HEAD_FLAGS
  put16(endHdr, 5, 7);
  put16(endHdr, 0, headerCrc16(endHdr, 2));

  // ── Concatenate everything ──
  const total = RAR_SIGNATURE.length + archHdr.length + fileHdr.length + dataLen + endHdr.length;
  const out = new Uint8Array(total);
  let pos = 0;

  out.set(RAR_SIGNATURE, pos); pos += RAR_SIGNATURE.length;
  out.set(archHdr, pos);       pos += archHdr.length;
  out.set(fileHdr, pos);       pos += fileHdr.length;
  out.set(fileData, pos);      pos += dataLen;
  out.set(endHdr, pos);

  return out;
}
