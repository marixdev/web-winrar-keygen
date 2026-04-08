/**
 * Test RAR4 archive builder — verify the output is a valid RAR archive.
 */
import { buildRar4Archive } from "./RarArchive.js";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  FAIL: ${msg}`);
    failed++;
  }
}

console.log("\n--- RAR4 Archive Builder ---");

{
  const encoder = new TextEncoder();
  const content = "RAR registration data\r\nGithub\r\nSingle PC usage license\r\nUID=ABCD1234EFGH5678\r\n";
  const fileData = encoder.encode(content);
  const rar = buildRar4Archive("rarreg.key", fileData);

  // Check RAR signature
  assert(rar[0] === 0x52, "RAR sig byte 0 = 0x52 ('R')");
  assert(rar[1] === 0x61, "RAR sig byte 1 = 0x61 ('a')");
  assert(rar[2] === 0x72, "RAR sig byte 2 = 0x72 ('r')");
  assert(rar[3] === 0x21, "RAR sig byte 3 = 0x21 ('!')");
  assert(rar[4] === 0x1a, "RAR sig byte 4 = 0x1A");
  assert(rar[5] === 0x07, "RAR sig byte 5 = 0x07");
  assert(rar[6] === 0x00, "RAR sig byte 6 = 0x00");

  // Check archive header type
  assert(rar[7 + 2] === 0x73, "Archive header type = 0x73");

  // Archive header size = 13
  const archSize = rar[7 + 5] | (rar[7 + 6] << 8);
  assert(archSize === 13, `Archive header size = ${archSize} (expected 13)`);

  // File header starts at 7 + 13 = 20
  const fhOffset = 20;
  assert(rar[fhOffset + 2] === 0x74, "File header type = 0x74");

  // Method = STORE (0x30)
  assert(rar[fhOffset + 25] === 0x30, "Compression method = 0x30 (STORE)");

  // File name
  const nameSize = rar[fhOffset + 26] | (rar[fhOffset + 27] << 8);
  assert(nameSize === 10, `Name size = ${nameSize} (expected 10 for 'rarreg.key')`);
  const nameBytes = rar.slice(fhOffset + 32, fhOffset + 32 + nameSize);
  const nameStr = new TextDecoder().decode(nameBytes);
  assert(nameStr === "rarreg.key", `File name = '${nameStr}'`);

  // Packed/unpacked size
  const view = new DataView(rar.buffer, rar.byteOffset);
  const packSize = view.getUint32(fhOffset + 7, true);
  const unpSize = view.getUint32(fhOffset + 11, true);
  assert(packSize === fileData.length, `Pack size = ${packSize} (expected ${fileData.length})`);
  assert(unpSize === fileData.length, `Unpack size = ${unpSize}`);

  // File data follows immediately after file header
  const dataOffset = fhOffset + 32 + nameSize;
  const extractedData = rar.slice(dataOffset, dataOffset + fileData.length);
  const extractedStr = new TextDecoder().decode(extractedData);
  assert(extractedStr === content, "Extracted data matches original");

  // End of archive marker
  const endOffset = dataOffset + fileData.length;
  assert(rar[endOffset + 2] === 0x7b, "End of archive header type = 0x7B");

  // Total size check
  const expectedSize = 7 + 13 + (32 + nameSize) + fileData.length + 7;
  assert(rar.length === expectedSize, `Total archive size = ${rar.length} (expected ${expectedSize})`);
}

console.log(`\n=== ${passed} passed, ${failed} failed ===`);
if (failed > 0) (globalThis as Record<string, unknown>)["process"] && (globalThis as unknown as { process: { exit: (c: number) => void } }).process.exit(1);
