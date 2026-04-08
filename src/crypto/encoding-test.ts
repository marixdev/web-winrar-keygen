/**
 * Quick test for encoding feature + keygen integration.
 */
import { Encoding, preprocessStrings, getEncoder, encodeWindows1252 } from "./Encoding.js";
import { generateRegisterInfo } from "./WinRarKeygen.js";

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

// ---- UTF-8 Encoding Tests ----
console.log("\n--- UTF-8 Encoding ---");

{
  // ASCII-only input: no prefix added
  const { displayUser, displayLicense } = preprocessStrings("Github", "Single PC usage license", Encoding.UTF8);
  assert(displayUser === "Github", "ASCII username unchanged in UTF-8 mode");
  assert(displayLicense === "Single PC usage license", "ASCII license unchanged in UTF-8 mode");
}

{
  // Non-ASCII input: "utf8:" prefix added
  const { displayUser, displayLicense } = preprocessStrings("Người dùng", "Giấy phép", Encoding.UTF8);
  assert(displayUser === "utf8:Người dùng", "Non-ASCII username gets utf8: prefix");
  assert(displayLicense === "utf8:Giấy phép", "Non-ASCII license gets utf8: prefix");
}

{
  // Already has prefix: no double-prefix
  const { displayUser } = preprocessStrings("utf8:Người dùng", "test", Encoding.UTF8);
  assert(displayUser === "utf8:Người dùng", "Already prefixed username not double-prefixed");
}

// ---- ASCII Encoding Tests ----
console.log("\n--- ASCII Encoding ---");

{
  const { displayUser } = preprocessStrings("Github", "License", Encoding.ASCII);
  assert(displayUser === "Github", "ASCII-only input passes ASCII validation");
}

{
  let threw = false;
  try {
    preprocessStrings("Người dùng", "License", Encoding.ASCII);
  } catch {
    threw = true;
  }
  assert(threw, "Non-ASCII username rejected in ASCII mode");
}

{
  let threw = false;
  try {
    preprocessStrings("User", "Giấy phép", Encoding.ASCII);
  } catch {
    threw = true;
  }
  assert(threw, "Non-ASCII license rejected in ASCII mode");
}

// ---- ANSI Encoding Tests ----
console.log("\n--- ANSI Encoding ---");

{
  // Latin-1 chars should pass
  const { displayUser } = preprocessStrings("Ärzte", "Lizenz", Encoding.ANSI);
  assert(displayUser === "Ärzte", "Latin-1 chars pass ANSI validation");
}

{
  // Windows-1252 special chars (€, ", etc.) should pass
  preprocessStrings("Price €100", "License", Encoding.ANSI);
  assert(true, "Windows-1252 special chars (€) pass ANSI validation");
}

{
  // CJK characters should fail
  let threw = false;
  try {
    preprocessStrings("用户", "License", Encoding.ANSI);
  } catch {
    threw = true;
  }
  assert(threw, "CJK chars rejected in ANSI mode");
}

{
  // Test encodeWindows1252
  const bytes = encodeWindows1252("ABC");
  assert(bytes[0] === 0x41 && bytes[1] === 0x42 && bytes[2] === 0x43, "encodeWindows1252 ASCII");

  const euroBytes = encodeWindows1252("€");
  assert(euroBytes[0] === 0x80, "encodeWindows1252 € → 0x80");

  const aeBytes = encodeWindows1252("Ä");
  assert(aeBytes[0] === 0xC4, "encodeWindows1252 Ä → 0xC4");
}

// ---- getEncoder Tests ----
console.log("\n--- getEncoder ---");

{
  const utf8Enc = getEncoder(Encoding.UTF8);
  const bytes = utf8Enc("ABC");
  assert(bytes[0] === 0x41, "UTF-8 encoder works for ASCII");

  const ansiEnc = getEncoder(Encoding.ANSI);
  const ansiBytes = ansiEnc("Ä");
  assert(ansiBytes.length === 1 && ansiBytes[0] === 0xC4, "ANSI encoder: Ä → single byte 0xC4");

  const utf8Bytes = utf8Enc("Ä");
  assert(utf8Bytes.length === 2, "UTF-8 encoder: Ä → 2 bytes (0xC3 0x84)");
}

// ---- Full Keygen Integration ----
console.log("\n--- Keygen Integration ---");

{
  // UTF-8 mode with ASCII input (should work same as before)
  const encoder = getEncoder(Encoding.UTF8);
  const info = generateRegisterInfo("Github", "Single PC usage license", encoder);
  assert(info.userName === "Github", "Keygen UTF-8: username correct");
  assert(info.items[0].length === 64, "Keygen UTF-8: items[0] is 64 chars");
  assert(info.hexData.length % 54 === 0, "Keygen UTF-8: hexData length valid");
}

{
  // UTF-8 mode with non-ASCII input (preprocessed with utf8: prefix)
  const { displayUser, displayLicense } = preprocessStrings("Người dùng", "Giấy phép", Encoding.UTF8);
  const encoder = getEncoder(Encoding.UTF8);
  const info = generateRegisterInfo(displayUser, displayLicense, encoder);
  assert(info.userName.startsWith("utf8:"), "Keygen UTF-8: non-ASCII has utf8: prefix");
  assert(info.hexData.length % 54 === 0, "Keygen UTF-8 non-ASCII: hexData length valid");
}

{
  // ANSI mode with Latin-1 input
  const { displayUser, displayLicense } = preprocessStrings("Ärzte", "Lizenz", Encoding.ANSI);
  const encoder = getEncoder(Encoding.ANSI);
  const info = generateRegisterInfo(displayUser, displayLicense, encoder);
  assert(info.userName === "Ärzte", "Keygen ANSI: username correct");
  assert(info.hexData.length % 54 === 0, "Keygen ANSI: hexData length valid");
}

{
  // ASCII mode
  const { displayUser, displayLicense } = preprocessStrings("Github", "License", Encoding.ASCII);
  const encoder = getEncoder(Encoding.ASCII);
  const info = generateRegisterInfo(displayUser, displayLicense, encoder);
  assert(info.userName === "Github", "Keygen ASCII: username correct");
  assert(info.hexData.length % 54 === 0, "Keygen ASCII: hexData length valid");
}

// ---- Summary ----
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
if (failed > 0) (globalThis as Record<string, unknown>)["process"] && (globalThis as unknown as { process: { exit: (c: number) => void } }).process.exit(1);
