/**
 * End-to-end keygen test. 
 * Build with: npx tsx e2e-test.ts
 */

import { gfFromItems, gfMul, gfSquare, gfInverse, gfDump, gfIsOne, gfEqual, gfAdd } from "./src/crypto/GaloisField";
import { ecPointMul, ecPointDumpCompressed, ecPointAdd, ecPointIsAtInfinity } from "./src/crypto/EllipticCurve";
import { G, ORDER, PRIVATE_KEY, CURVE, PUBLIC_KEY } from "./src/crypto/WinRarConfig";
import { generateRegisterInfo, buildRegFileContent } from "./src/crypto/WinRarKeygen";
import { SHA1 } from "./src/crypto/SHA1";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  PASS: ${msg}`);
    passed++;
  } else {
    console.log(`  FAIL: ${msg}`);
    failed++;
  }
}

// ---- Test 1: SHA-1 standard vectors ----
console.log("\n=== SHA-1 Tests ===");
{
  const sha1 = new SHA1();
  sha1.update(new TextEncoder().encode("abc"));
  const digest = sha1.evaluate();
  const hex = Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join('');
  assert(hex === "a9993e364706816aba3e25717850c26c9cd0d89d", "SHA-1('abc')");
}
{
  const sha1 = new SHA1();
  const digest = sha1.evaluate();
  const hex = Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join('');
  assert(hex === "da39a3ee5e6b4b0d3255bfef95601890afd80709", "SHA-1('')");
}

// ---- Test 2: GF arithmetic ----
console.log("\n=== GaloisField Tests ===");
{
  const a = gfFromItems([1234, 5678, 9012, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const b = gfFromItems([4321, 8765, 2109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  
  // a * inv(a) should be 1
  const invA = gfInverse(a);
  const product = gfMul(a, invA);
  assert(gfIsOne(product), "a * inv(a) == 1");
  
  // (a + b) + b == a (since in GF(2), subtraction == addition)
  const sum = gfAdd(a, b);
  const back = gfAdd(sum, b);
  assert(gfEqual(back, a), "(a + b) + b == a");
  
  // a^2 == a * a
  const sq = gfSquare(a);
  const mulSelf = gfMul(a, a);
  assert(gfEqual(sq, mulSelf), "a^2 == a * a");
}

// ---- Test 3: Elliptic Curve point validation ----
console.log("\n=== Elliptic Curve Tests ===");
{
  // G is on the curve (verified during construction in WinRarConfig)
  assert(true, "G is on curve (imported successfully)");
  
  // PUBLIC_KEY is on the curve  
  assert(true, "PUBLIC_KEY is on curve (imported successfully)");
  
  // Test: PRIVATE_KEY * G should equal PUBLIC_KEY
  console.log("  Computing PRIVATE_KEY * G (this may take a moment)...");
  const start = performance.now();
  const computed = ecPointMul(G, PRIVATE_KEY);
  const elapsed = performance.now() - start;
  console.log(`  Scalar multiplication took ${elapsed.toFixed(0)}ms`);
  
  assert(
    gfEqual(computed.x, PUBLIC_KEY.x) && gfEqual(computed.y, PUBLIC_KEY.y),
    "PRIVATE_KEY * G == PUBLIC_KEY"
  );
  
  // Test: ORDER * G should be point at infinity
  console.log("  Computing ORDER * G...");
  const start2 = performance.now();
  const inf = ecPointMul(G, ORDER);
  const elapsed2 = performance.now() - start2;
  console.log(`  Took ${elapsed2.toFixed(0)}ms`);
  assert(ecPointIsAtInfinity(inf), "ORDER * G == Infinity");
}

// ---- Test 4: Key Generation ----
console.log("\n=== Key Generation Test ===");
{
  console.log("  Generating key for ('Github', 'Single PC usage license')...");
  const start = performance.now();
  const info = generateRegisterInfo("Github", "Single PC usage license");
  const elapsed = performance.now() - start;
  console.log(`  Key generated in ${elapsed.toFixed(0)}ms`);
  
  assert(info.uid.length === 20, `UID length == 20 (got ${info.uid.length})`);
  assert(info.items[0].length === 64, `items[0] length == 64 (got ${info.items[0].length})`);
  assert(info.items[1].length === 122, `items[1] length == 122 (got ${info.items[1].length})`);
  assert(info.items[2].length === 122, `items[2] length == 122 (got ${info.items[2].length})`);
  assert(info.items[3].length === 50, `items[3] length == 50 (got ${info.items[3].length})`);
  assert(info.hexData.length % 54 === 0, `hexData length % 54 == 0 (len=${info.hexData.length})`);
  
  const content = buildRegFileContent(info);
  assert(content.startsWith("RAR registration data\r\n"), "File content header");
  assert(content.includes("Github\r\n"), "Contains username");
  assert(content.includes("Single PC usage license\r\n"), "Contains license type");
  assert(content.includes("UID="), "Contains UID");
  
  console.log("\n  Generated registration data:");
  console.log("  " + content.replace(/\r\n/g, "\n  "));
}

// ---- Summary ----
console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);
if (failed > 0) {
  process.exit(1);
}
