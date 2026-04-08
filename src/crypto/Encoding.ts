/**
 * Encoding support for WinRAR keygen.
 *   - UTF-8: Prepends "utf8:" prefix for non-ASCII chars, encodes to UTF-8 bytes
 *   - ASCII: Rejects non-ASCII characters
 *   - ANSI:  Encodes using Windows-1252 codepage (most common Western ANSI codepage)
 */

export const Encoding = {
  UTF8: "utf8",
  ASCII: "ascii",
  ANSI: "ansi",
} as const;

export type Encoding = (typeof Encoding)[keyof typeof Encoding];

// Windows-1252 has special mappings for code points 128-159
// (these slots are undefined in ISO-8859-1 but Windows-1252 maps them to various characters)
const WIN1252_SPECIAL: Record<number, number> = {
  0x20ac: 0x80, // €
  0x201a: 0x82, // ‚
  0x0192: 0x83, // ƒ
  0x201e: 0x84, // „
  0x2026: 0x85, // …
  0x2020: 0x86, // †
  0x2021: 0x87, // ‡
  0x02c6: 0x88, // ˆ
  0x2030: 0x89, // ‰
  0x0160: 0x8a, // Š
  0x2039: 0x8b, // ‹
  0x0152: 0x8c, // Œ
  0x017d: 0x8e, // Ž
  0x2018: 0x91, // '
  0x2019: 0x92, // '
  0x201c: 0x93, // "
  0x201d: 0x94, // "
  0x2022: 0x95, // •
  0x2013: 0x96, // –
  0x2014: 0x97, // —
  0x02dc: 0x98, // ˜
  0x2122: 0x99, // ™
  0x0161: 0x9a, // š
  0x203a: 0x9b, // ›
  0x0153: 0x9c, // œ
  0x017e: 0x9e, // ž
  0x0178: 0x9f, // Ÿ
};

function hasNonAscii(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 127) return true;
  }
  return false;
}

/**
 * Preprocess username and license strings according to encoding rules:
 * - UTF-8: add "utf8:" prefix for non-ASCII strings
 * - ASCII: validate ASCII-only
 * - ANSI: validate Windows-1252 representable
 *
 * Returns the display strings (which are also used for key generation).
 */
export function preprocessStrings(
  userName: string,
  licenseType: string,
  encoding: Encoding
): { displayUser: string; displayLicense: string } {
  switch (encoding) {
    case Encoding.UTF8: {
      let displayUser = userName;
      let displayLicense = licenseType;
      if (
        hasNonAscii(displayUser) &&
        (displayUser.length < 5 || displayUser.substring(0, 5) !== "utf8:")
      ) {
        displayUser = "utf8:" + displayUser;
      }
      if (
        hasNonAscii(displayLicense) &&
        (displayLicense.length < 5 ||
          displayLicense.substring(0, 5) !== "utf8:")
      ) {
        displayLicense = "utf8:" + displayLicense;
      }
      return { displayUser, displayLicense };
    }
    case Encoding.ASCII: {
      if (hasNonAscii(userName)) {
        throw new Error(
          "Username contains non-ASCII characters. Use UTF-8 or ANSI encoding."
        );
      }
      if (hasNonAscii(licenseType)) {
        throw new Error(
          "License name contains non-ASCII characters. Use UTF-8 or ANSI encoding."
        );
      }
      return { displayUser: userName, displayLicense: licenseType };
    }
    case Encoding.ANSI: {
      validateWindows1252(userName, "Username");
      validateWindows1252(licenseType, "License name");
      return { displayUser: userName, displayLicense: licenseType };
    }
  }
}

function validateWindows1252(s: string, fieldName: string): void {
  for (let i = 0; i < s.length; i++) {
    const cp = s.codePointAt(i)!;
    if (cp > 0xffff) {
      // Surrogate pair / supplementary character — skip the trailing surrogate
      i++;
      throw new Error(
        `${fieldName} contains characters not representable in Windows-1252 (ANSI). Use UTF-8 encoding.`
      );
    }
    if (cp <= 127) continue; // ASCII range
    if (cp >= 160 && cp <= 255) continue; // Latin-1 supplement (direct mapping)
    if (WIN1252_SPECIAL[cp] !== undefined) continue; // Windows-1252 special slots
    throw new Error(
      `${fieldName} contains characters not representable in Windows-1252 (ANSI). Use UTF-8 encoding.`
    );
  }
}

/**
 * Encode a string to Windows-1252 bytes.
 * Code points 0-127 map directly; 160-255 map directly;
 * special characters in the 128-159 range are mapped via the WIN1252_SPECIAL table.
 */
export function encodeWindows1252(s: string): Uint8Array {
  const bytes: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const cp = s.codePointAt(i)!;
    if (cp <= 127) {
      bytes.push(cp);
    } else if (cp >= 160 && cp <= 255) {
      bytes.push(cp);
    } else if (WIN1252_SPECIAL[cp] !== undefined) {
      bytes.push(WIN1252_SPECIAL[cp]);
    } else {
      throw new Error(
        `Cannot encode U+${cp.toString(16).padStart(4, "0").toUpperCase()} in Windows-1252`
      );
    }
  }
  return new Uint8Array(bytes);
}

/**
 * Returns a string→bytes encoder function for the given encoding.
 * Used by WinRarKeygen to convert strings to bytes for hashing/signing.
 */
export function getEncoder(encoding: Encoding): (s: string) => Uint8Array {
  switch (encoding) {
    case Encoding.UTF8:
    case Encoding.ASCII:
      return (s: string) => new TextEncoder().encode(s);
    case Encoding.ANSI:
      return encodeWindows1252;
  }
}
