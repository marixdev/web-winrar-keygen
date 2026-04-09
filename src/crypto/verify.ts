/**
 * Comprehensive verification of crypto modules against known C++ reference values.
 * Run with: npx tsx src/crypto/verify.ts
 */

import { SHA1 } from './SHA1';
import { CRC32, crc32 } from './CRC32';
import { gfFromItems, gfMul, gfSquare, gfAdd, gfIsZero, gfDump, gfLoad, gfEqual, gfInverse, gfOne } from './GaloisField';
import { ecPointMul, ecPointIsAtInfinity } from './EllipticCurve';
import { CURVE, G, ORDER, PRIVATE_KEY } from './WinRarConfig';
import { bigintFromUint16LE, bigintToHex } from './BigIntUtils';
import { generateRegisterInfo, buildRegFileContent } from './WinRarKeygen';
import { getEncoder, Encoding } from './Encoding';

let passed = 0, failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) { passed++; console.log(`  ✓ ${msg}`); }
  else { failed++; console.error(`  ✗ FAIL: ${msg}`); }
}

// ─── 1. SHA-1 known test vectors ─────────────────────────────────────────────
console.log('\n=== SHA-1 ===');
{
  const hex = (b: Uint8Array) => [...b].map(x => x.toString(16).padStart(2, '0')).join('');

  // SHA-1("") = da39a3ee5e6b4b0d3255bfef95601890afd80709
  const d1 = new SHA1().evaluate();
  assert(hex(d1) === 'da39a3ee5e6b4b0d3255bfef95601890afd80709', 'SHA-1("")');

  // SHA-1("abc") = a9993e364706816aba3e25717850c26c9cd0d89d
  const d2 = new SHA1().updateString('abc').evaluate();
  assert(hex(d2) === 'a9993e364706816aba3e25717850c26c9cd0d89d', 'SHA-1("abc")');

  // SHA-1("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")
  const d3 = new SHA1().updateString('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq').evaluate();
  assert(hex(d3) === '84983e441c3bd26ebaae4aa1f95129e5e54670f1', 'SHA-1(448-bit msg)');
}

// ─── 2. CRC-32 ──────────────────────────────────────────────────────────────
console.log('\n=== CRC-32 ===');
{
  // CRC-32("123456789") = CBF43926
  const c = new CRC32().updateString('123456789').evaluate();
  assert(c === 0xCBF43926, `CRC-32("123456789") = ${c.toString(16)} (expected cbf43926)`);

  // One-shot
  const c2 = crc32(new TextEncoder().encode('123456789'));
  assert(c2 === 0xCBF43926, 'crc32 one-shot matches class');
}

// ─── 3. GaloisField basics ──────────────────────────────────────────────────
console.log('\n=== GaloisField ===');
{
  const a = gfFromItems([0x1234, 0x5678]);
  const one = gfOne();

  // a * 1 = a
  const prod = gfMul(a, one);
  assert(gfEqual(prod, a), 'gfMul(a, 1) == a');

  // a * inverse(a) = 1
  const inv = gfInverse(a);
  const check = gfMul(a, inv);
  assert(gfEqual(check, one), 'a * inverse(a) == 1');

  // dump/load round-trip
  const dumped = gfDump(a);
  const loaded = gfLoad(dumped);
  assert(gfEqual(loaded, a), 'gfDump/gfLoad round-trip');

  // a + a = 0 (characteristic 2)
  const sum = gfAdd(a, a);
  assert(gfIsZero(sum), 'a + a == 0 in char 2');

  // (a²) = a * a
  const sq = gfSquare(a);
  const sq2 = gfMul(a, a);
  assert(gfEqual(sq, sq2), 'gfSquare(a) == gfMul(a, a)');
}

// ─── 4. EC point on curve check ─────────────────────────────────────────────
console.log('\n=== EllipticCurve ===');
{
  // Verify G is on the curve: y² + xy = x³ + Ax² + B
  const { x, y } = G;
  const lhs = gfAdd(gfSquare(y), gfMul(x, y));           // y² + xy
  const rhs = gfAdd(gfAdd(gfMul(gfSquare(x), x), gfMul(CURVE.A, gfSquare(x))), CURVE.B);  // x³ + Ax² + B
  assert(gfEqual(lhs, rhs), 'G is on the curve');

  // G * ORDER = point at infinity
  const inf = ecPointMul(CURVE, G, ORDER);
  assert(ecPointIsAtInfinity(inf), 'G * ORDER = ∞');
}

// ─── 5. Private key derivation ──────────────────────────────────────────────
console.log('\n=== Private Key Derivation ===');
{
  // Replicate derivePrivateKey(null) inline to verify
  const gen = new Uint32Array(6);
  gen[1] = 0xeb3eb781;
  gen[2] = 0x50265329;
  gen[3] = 0xdc5ef4a3;
  gen[4] = 0x6847b9d5;
  gen[5] = 0xcde43b4c;

  const rawKey = new Uint16Array(15);
  for (let i = 0; i < 15; i++) {
    gen[0] = i + 1;
    const buf = new Uint8Array(24);
    const bv = new DataView(buf.buffer);
    for (let j = 0; j < 6; j++) bv.setUint32(j * 4, gen[j], true); // LE!
    const digest = new SHA1().update(buf).evaluate();
    const dv = new DataView(digest.buffer, digest.byteOffset, digest.byteLength);
    rawKey[i] = dv.getUint32(0, false) & 0xffff;
  }
  const derivedKey = bigintFromUint16LE(rawKey, 15);

  assert(
    derivedKey === PRIVATE_KEY,
    `derivePrivateKey(null) = ${bigintToHex(derivedKey, 60)}\n    expected              = ${bigintToHex(PRIVATE_KEY, 60)}`
  );
}

// ─── 6. Public key verification (PRIVATE_KEY × G = known PUBLIC_KEY) ────────
console.log('\n=== Public Key ===');
{
  const pubKey = ecPointMul(CURVE, G, PRIVATE_KEY);
  const expectedX = gfFromItems([
    0x3A1A, 0x1109, 0x268A, 0x12F7,
    0x3734, 0x75F0, 0x576C, 0x2EA4,
    0x4813, 0x3F62, 0x0567, 0x784D,
    0x753D, 0x6D92, 0x366C, 0x1107,
    0x3861,
  ]);
  const expectedY = gfFromItems([
    0x6C20, 0x6027, 0x1B22, 0x7A87,
    0x43C4, 0x1908, 0x2449, 0x4675,
    0x7933, 0x2E66, 0x32F5, 0x2A58,
    0x1145, 0x74AC, 0x36D0, 0x2731,
    0x12B6,
  ]);
  assert(gfEqual(pubKey.x, expectedX), 'PRIVATE_KEY × G → correct x');
  assert(gfEqual(pubKey.y, expectedY), 'PRIVATE_KEY × G → correct y');
}

// ─── 7. Full key generation ─────────────────────────────────────────────────
console.log('\n=== Full Key Generation ===');
{
  const enc = getEncoder(Encoding.UTF8);
  
  // Now run the actual generateRegisterInfo
  try {
    const info = generateRegisterInfo('Github', 'Single PC usage license', enc);

    assert(info.uid.length === 20, `UID length = ${info.uid.length} (expected 20)`);
    assert(info.items[0].length === 64, `items[0] length = ${info.items[0].length} (expected 64)`);
    assert(info.items[1].length === 122, `items[1] length = ${info.items[1].length} (expected 122)`);
    assert(info.items[2].length === 122, `items[2] length = ${info.items[2].length} (expected 122)`);
    assert(info.items[3].length === 50, `items[3] length = ${info.items[3].length} (expected 50)`);
    assert(info.hexData.length % 54 === 0, `hexData length ${info.hexData.length} is multiple of 54`);

    const content = buildRegFileContent(info);
    assert(content.startsWith('RAR registration data\r\n'), 'File starts with correct header');

    // Verify against known C++ output (deterministic parts)
    assert(info.uid === '3a3d02329a32b63da7d8', `UID matches C++ reference: "${info.uid}"`);
    assert(info.items[0] === 'a7d8753c5e7037d83011171578c57042fa30c506caae9954e4853d415ec594e4',
      `items[0] matches C++ reference`);

    console.log('\n--- Generated rarreg.key ---');
    console.log(content);
  } catch (e) {
    console.error(`  ERROR in generateRegisterInfo: ${e}`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
if (failed > 0) throw new Error(`${failed} tests failed`);
