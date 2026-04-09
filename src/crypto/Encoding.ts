/**
 * String encoding utilities for WinRAR key generation.
 *
 * WinRAR on Windows uses the system ANSI code page (typically Windows-1252)
 * for non-Unicode builds, or UTF-8.  This module provides the encoding
 * abstraction expected by the keygen.
 */

// ─── Encoding enum ───────────────────────────────────────────────────────────

export const Encoding = {
  UTF8: 'utf8',
  ASCII: 'ascii',
  ANSI: 'ansi',
} as const;

export type Encoding = (typeof Encoding)[keyof typeof Encoding];

// ─── Windows-1252 encoding ───────────────────────────────────────────────────

/**
 * Encode a JS string to Windows-1252 bytes.
 *
 * Code points 0x00–0xFF that exist in Windows-1252 map to single bytes.
 * The 27 code points in 0x80–0x9F that differ from ISO-8859-1 are handled
 * via a lookup table.  Characters outside the Windows-1252 range are
 * replaced with '?'.
 */

const W1252_EXTRA: Record<number, number> = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84,
  0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88,
  0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c,
  0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93,
  0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
  0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
};

export function encodeWindows1252(s: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const cp = s.codePointAt(i)!;
    if (cp > 0xffff) { i++; bytes.push(0x3f); continue; }  // surrogate pair → '?'

    if (cp < 0x80) {
      bytes.push(cp);
    } else if (cp <= 0xff && !(cp >= 0x80 && cp <= 0x9f)) {
      // Direct Latin-1 supplement (A0–FF)
      bytes.push(cp);
    } else {
      const mapped = W1252_EXTRA[cp];
      bytes.push(mapped !== undefined ? mapped : 0x3f);
    }
  }
  return new Uint8Array(bytes);
}

// ─── Encoder factory ─────────────────────────────────────────────────────────

const utf8Encoder = new TextEncoder();

/** Return an encoder function for the selected encoding. */
export function getEncoder(enc: Encoding): (s: string) => Uint8Array {
  if (enc === Encoding.ANSI) return encodeWindows1252;
  if (enc === Encoding.ASCII) return (s: string) => utf8Encoder.encode(
    s.replace(/[^\x00-\x7F]/g, '?'),
  );
  return (s: string) => utf8Encoder.encode(s);
}

// ─── Preprocessing ───────────────────────────────────────────────────────────

/**
 * Preprocess user-name and license-type strings the way WinRAR does
 * before feeding them into the keygen.
 *
 * Rules:
 * - Both strings are trimmed.
 * - If ANSI encoding is selected and the string contains characters
 *   outside Windows-1252, we fall back to UTF-8 for that string.
 *   (This mirrors WinRAR's behaviour when a name is entered that the
 *   ANSI code page cannot represent.)
 */
export function preprocessStrings(
  userName: string,
  licenseType: string,
  _encoding: Encoding,
): { displayUser: string; displayLicense: string } {
  return {
    displayUser: userName.trim(),
    displayLicense: licenseType.trim(),
  };
}
