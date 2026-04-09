# WinRAR Keygen - Web Edition

> **[wrkg.me](https://wrkg.me)**  Generate WinRAR license keys directly in your browser. No downloads, no installs, no server-side processing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-8-646cff.svg)

---

## Features

- **100% Client-Side**  All cryptographic operations run in your browser. No data is ever sent to a server.
- **Pure TypeScript Crypto**  Clean-room implementation of GF(2^15), extension field GF((2^15)^17), elliptic curve operations, SHA-1, ECDSA signing, and CRC-32.
- **Zero Crypto Dependencies**  No external crypto libraries. Only uses native Web APIs (`TextEncoder`, `crypto.getRandomValues`, `DataView`).
- **14 Languages**  English, Vietnamese, Indonesian, Chinese, Korean, Japanese, French, German, Spanish, Thai, Malay, Russian, Filipino, Portuguese.
- **Auto Language Detection**  Detects your language from IP geolocation (via ip-api.com) with browser locale fallback.
- **Light & Dark Theme**  Toggle between light and dark mode, persisted in localStorage.
- **Multiple Export Formats**  Copy to clipboard as text, or download as a `.rarreg.key` file.
- **Multiple Encodings**  UTF-8, GBK, Big5, Shift-JIS for CJK compatibility.
- **Cloudflare Turnstile**  Bot protection via invisible CAPTCHA challenge.
- **Visit Counter**  Real-time visitor count via CountAPI.
- **Responsive Design**  Works on desktop, tablet, and mobile.
- **How It Works**  Detailed technical explanation of the math and cryptography behind WinRAR key generation.
- **SEO Optimized**  Includes sitemap.xml, robots.txt, Open Graph meta tags.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 6.0 |
| Build Tool | Vite 8 |
| Styling | Plain CSS with CSS variables (no framework) |
| Crypto | Pure TypeScript (zero dependencies) |
| Bot Protection | Cloudflare Turnstile |
| Deployment | Vercel |
| Domain | [wrkg.me](https://wrkg.me) |

## Project Structure

```
web-winrar-keygen/
 public/                    # Static assets (favicons, robots.txt, sitemap.xml)
 src/
    components/
       KeygenForm.tsx     # Main keygen form UI
       HowItWorks.tsx     # Technical explanation page
       LanguageSelector.tsx
       ThemeToggle.tsx
       TurnstileWidget.tsx
       UsageGuide.tsx
       VisitCounter.tsx
    crypto/
       GaloisField.ts     # GF(2^15) and GF((2^15)^17) arithmetic
       EllipticCurve.ts   # EC point operations over GF((2^15)^17)
       SHA1.ts            # SHA-1 hash (pure TypeScript)
       BigIntUtils.ts     # Big integer utilities
       CRC32.ts           # CRC-32 checksum
       WinRarConfig.ts    # Curve parameters, generator point, public key
       WinRarKeygen.ts    # Key generation (ECDSA signing)
       RarArchive.ts      # rarreg.key file builder
       Encoding.ts        # UTF-8, GBK, Big5, Shift-JIS encoding
       verify.ts          # Test suite (24 tests)
    locales/
       *.json             # UI translations (14 languages)
       hiw/*.json         # "How It Works" translations (14 languages)
    App.tsx                # Main app with tab navigation
    i18n.ts                # Internationalization system
    i18n-hiw.ts            # HowItWorks i18n
    theme.ts               # Theme context (light/dark)
    main.tsx               # Entry point
 index.html
 package.json
 vite.config.ts
 vercel.json
 tsconfig.json
```

## Cryptography Overview

The keygen implements the same elliptic curve signature scheme used by WinRAR's license validation:

1. **Finite Field**  Arithmetic in GF(2^15) with irreducible polynomial x^15 + x + 1, extended to GF((2^15)^17).
2. **Elliptic Curve**  Curve y + xy = x + Ax + B over the extension field, with a specific generator point G of known order.
3. **Key Derivation**  The license text (username + license type + UID + timestamp) is hashed with SHA-1, then an ECDSA-like signature is computed.
4. **Encoding**  The signature is formatted as a `rarreg.key` file with CRC-32 checksums, matching WinRAR's expected format.

All implementations are **clean-room TypeScript**  written independently from scratch based on the mathematical specifications.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/marixdev/web-winrar-keygen.git
cd web-winrar-keygen

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## How to Use

1. Visit **[wrkg.me](https://wrkg.me)**
2. Enter any username (or leave the default)
3. Select a license type
4. Complete the Turnstile challenge
5. Click **Generate**
6. Copy the key text or download the `.rarreg.key` file
7. Place `rarreg.key` in WinRAR's installation directory (e.g., `C:\Program Files\WinRAR\`)

## License

MIT

---

<p align="center">
  <b>Made with math, not magic.</b>
</p>
