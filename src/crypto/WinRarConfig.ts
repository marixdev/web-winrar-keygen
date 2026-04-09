/**
 * WinRAR cryptographic constants.
 *
 * Curve:  y² + xy = x³ + Ax² + B  over GF((2¹⁵)¹⁷)
 * with A = 0, B = 161.
 *
 * Generator G, group order, and server private key.
 */

import { gfFromItems } from './GaloisField';
import type { ECCurve, ECPoint } from './EllipticCurve';

// ─── Curve parameters ────────────────────────────────────────────────────────

export const CURVE: ECCurve = {
  A: gfFromItems([0]),
  B: gfFromItems([161]),
};

// ─── Generator point G ───────────────────────────────────────────────────────

export const G: ECPoint = {
  x: gfFromItems([
    0x38CC, 0x052F, 0x2510, 0x45AA,
    0x1B89, 0x4468, 0x4882, 0x0D67,
    0x4FEB, 0x55CE, 0x0025, 0x4CB7,
    0x0CC2, 0x59DC, 0x289E, 0x65E3,
    0x56FD,
  ]),
  y: gfFromItems([
    0x31A7, 0x65F2, 0x18C4, 0x3412,
    0x7388, 0x54C1, 0x539B, 0x4A02,
    0x4D07, 0x12D6, 0x7911, 0x3B5E,
    0x4F0E, 0x216F, 0x2BF2, 0x1974,
    0x20DA,
  ]),
};

// ─── Group order ─────────────────────────────────────────────────────────────

export const ORDER = 0x1026dd85081b82314691ced9bbec30547840e4bf72d8b5e0d258442bbcd31n;

// ─── Private key ─────────────────────────────────────────────────────────────

export const PRIVATE_KEY = 0x59fe6abcca90bdb95f0105271fa85fb9f11f467450c1ae9044b7fd61d65en;
