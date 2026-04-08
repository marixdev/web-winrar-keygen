/**
 * Minimal RAR4 archive builder.
 * Creates a valid RAR archive containing a single STORED (uncompressed) file.
 * Used to produce `rarkey.rar` containing `rarreg.key`.
 *
 * RAR4 format reference:
 *   - Marker block (7 bytes)
 *   - Archive header (HEAD_TYPE=0x73, 13 bytes)
 *   - File header  (HEAD_TYPE=0x74, 32 + nameLen bytes) + file data
 *   - End of archive (HEAD_TYPE=0x7B, 7 bytes)
 *
 * CRC for headers = CRC32(data from HEAD_TYPE onwards) & 0xFFFF
 */

// ---- CRC32 table (same polynomial as standard CRC-32) ----
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function crc16FromCrc32(data: Uint8Array): number {
  return crc32(data) & 0xffff;
}

/** Convert a Date to MS-DOS date/time packed into a uint32 (little-endian semantics). */
function dosDateTime(d: Date): number {
  const sec = Math.floor(d.getSeconds() / 2) & 0x1f;
  const min = d.getMinutes() & 0x3f;
  const hour = d.getHours() & 0x1f;
  const day = d.getDate() & 0x1f;
  const month = (d.getMonth() + 1) & 0x0f;
  const year = (d.getFullYear() - 1980) & 0x7f;

  const time = (hour << 11) | (min << 5) | sec;
  const date = (year << 9) | (month << 5) | day;
  return (date << 16) | time;
}

/**
 * Build a valid RAR4 archive containing a single file.
 *
 * @param fileName  Name of the file inside the archive (e.g. "rarreg.key")
 * @param fileData  Raw file content as Uint8Array
 * @returns         Complete RAR archive as Uint8Array
 */
export function buildRar4Archive(fileName: string, fileData: Uint8Array): Uint8Array {
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(fileName);

  // ---- 1. Marker block (7 bytes) ----
  const marker = new Uint8Array([0x52, 0x61, 0x72, 0x21, 0x1a, 0x07, 0x00]);

  // ---- 2. Archive header (13 bytes) ----
  // HEAD_TYPE=0x73, HEAD_FLAGS=0x0000, HEAD_SIZE=13
  // Reserved1=0x0000, Reserved2=0x00000000
  const archHdr = new Uint8Array(13);
  const archView = new DataView(archHdr.buffer);
  // archHdr[0..1] = HEAD_CRC (filled later)
  archHdr[2] = 0x73; // HEAD_TYPE
  archView.setUint16(3, 0x0000, true); // HEAD_FLAGS
  archView.setUint16(5, 13, true); // HEAD_SIZE
  archView.setUint16(7, 0, true); // Reserved1
  archView.setUint32(9, 0, true); // Reserved2
  // Calculate CRC over bytes 2..12 (HEAD_TYPE onwards)
  const archCrc = crc16FromCrc32(archHdr.subarray(2));
  archView.setUint16(0, archCrc, true);

  // ---- 3. File header + data ----
  const fileHeaderSize = 32 + nameBytes.length;
  const fileHdr = new Uint8Array(fileHeaderSize);
  const fhView = new DataView(fileHdr.buffer);

  const fileCrc = crc32(fileData);
  const now = new Date();
  const dosTime = dosDateTime(now);

  // fhView[0..1] = HEAD_CRC (filled later)
  fileHdr[2] = 0x74; // HEAD_TYPE = FILE_HEAD
  fhView.setUint16(3, 0x8000, true); // HEAD_FLAGS: 0x8000 = LONG_BLOCK (data follows header)
  fhView.setUint16(5, fileHeaderSize, true); // HEAD_SIZE
  fhView.setUint32(7, fileData.length, true); // PACK_SIZE (= UNP_SIZE for STORE)
  fhView.setUint32(11, fileData.length, true); // UNP_SIZE
  fileHdr[15] = 2; // HOST_OS: 2 = Win32
  fhView.setUint32(16, fileCrc, true); // FILE_CRC
  fhView.setUint32(20, dosTime, true); // FTIME
  fileHdr[24] = 20; // UNP_VER: version needed to extract (2.0)
  fileHdr[25] = 0x30; // METHOD: 0x30 = STORE (no compression)
  fhView.setUint16(26, nameBytes.length, true); // NAME_SIZE
  fhView.setUint32(28, 0x20, true); // ATTR: FILE_ATTRIBUTE_ARCHIVE
  // File name
  fileHdr.set(nameBytes, 32);

  // Calculate header CRC over bytes 2..end
  const fhCrc = crc16FromCrc32(fileHdr.subarray(2));
  fhView.setUint16(0, fhCrc, true);

  // ---- 4. End of archive (7 bytes) ----
  const endHdr = new Uint8Array(7);
  const endView = new DataView(endHdr.buffer);
  // endHdr[0..1] = HEAD_CRC (filled later)
  endHdr[2] = 0x7b; // HEAD_TYPE = ENDARC_HEAD
  endView.setUint16(3, 0x4000, true); // HEAD_FLAGS
  endView.setUint16(5, 7, true); // HEAD_SIZE
  const endCrc = crc16FromCrc32(endHdr.subarray(2));
  endView.setUint16(0, endCrc, true);

  // ---- Assemble ----
  const totalSize =
    marker.length + archHdr.length + fileHdr.length + fileData.length + endHdr.length;
  const archive = new Uint8Array(totalSize);
  let offset = 0;

  archive.set(marker, offset);
  offset += marker.length;

  archive.set(archHdr, offset);
  offset += archHdr.length;

  archive.set(fileHdr, offset);
  offset += fileHdr.length;

  archive.set(fileData, offset);
  offset += fileData.length;

  archive.set(endHdr, offset);

  return archive;
}
