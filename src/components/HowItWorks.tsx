import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "../i18n";
import { hiwTranslations } from "../i18n-hiw";

/* ── Intersection Observer hook for scroll-reveal ── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── 3-D tilt on mouse move ── */
function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.01,1.01,1.01)`;
  }, [intensity]);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  }, []);
  return { ref, handleMove, handleLeave };
}

/* ── Floating particles in hero ── */
function HeroParticles() {
  return (
    <div className="hiw-particles" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <span key={i} className="hiw-particle" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 6}s`,
          animationDuration: `${4 + Math.random() * 5}s`,
          fontSize: `${6 + Math.random() * 10}px`,
          opacity: 0.15 + Math.random() * 0.3,
        }} />
      ))}
    </div>
  );
}

interface SectionProps {
  icon: string;
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  delay?: number;
}

function Section({ icon, number, title, children, defaultOpen = false, delay = 0 }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const { ref, visible } = useReveal();
  const tilt = useTilt(5);

  return (
    <div
      ref={ref}
      className={`hiw-section hiw-reveal ${visible ? "hiw-visible" : ""} ${open ? "hiw-section--open" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div ref={tilt.ref} onMouseMove={tilt.handleMove} onMouseLeave={tilt.handleLeave} className="hiw-section-inner">
        <button className="hiw-section-header" onClick={() => setOpen(v => !v)}>
          <span className="hiw-section-icon">{icon}</span>
          <span className="hiw-section-num">{String(number).padStart(2, "0")}</span>
          <span className="hiw-section-title">{title}</span>
          <svg className={`hiw-chevron ${open ? "hiw-chevron--open" : ""}`} width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {open && <div className="hiw-section-body hiw-body-enter">{children}</div>}
      </div>
      {/* Glow border effect */}
      <div className="hiw-glow" />
    </div>
  );
}



function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="hiw-codeblock">
      {title && <div className="hiw-codeblock-title">{title}</div>}
      <pre>{children}</pre>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return <div className="hiw-formula">{children}</div>;
}

function InfoCard({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="hiw-infocard">
      <div className="hiw-infocard-header">
        <span className="hiw-infocard-emoji">{emoji}</span>
        <strong>{title}</strong>
      </div>
      <div className="hiw-infocard-body">{children}</div>
    </div>
  );
}

function CompareTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="hiw-table-wrap">
      <table className="hiw-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HowItWorks() {
  const { lang } = useI18n();
  const t = hiwTranslations[lang] ?? hiwTranslations.en;

  return (
    <div className="hiw-container">
      <div className="hiw-hero">
        <HeroParticles />
        <div className="hiw-hero-orb" />
        <div className="hiw-hero-icon">🔐</div>
        <h1 className="hiw-hero-title">{t.hiwTitle}</h1>
        <p className="hiw-hero-subtitle">{t.hiwSubtitle}</p>
      </div>

      {/* Flow overview — 3D cards */}
      <div className="hiw-flow hiw-glass">
        {[
          { icon: "👤", label: t.hiwFlowUser },
          { icon: "🔑", label: t.hiwFlowKey },
          { icon: "✍️", label: t.hiwFlowSign },
          { icon: "📄", label: "rarreg.key" },
        ].map((s, i, a) => (
          <div key={i} className="hiw-flow-group">
            <div className="hiw-flow-step hiw-float" style={{ animationDelay: `${i * 0.3}s` }}>
              <div className="hiw-flow-icon">{s.icon}</div>
              <div className="hiw-flow-label">{s.label}</div>
            </div>
            {i < a.length - 1 && <div className="hiw-flow-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="hiw-arrow-svg">
                <path d="M5 12h14m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>}
          </div>
        ))}
      </div>

      {/* Section 1: Overview */}
      <Section icon="🌐" number={1} title={t.hiwS1Title} defaultOpen delay={0}>
        <p>{t.hiwS1P1}</p>
        <InfoCard emoji="⚡" title={t.hiwS1KeyPoint}>
          <p>{t.hiwS1P2}</p>
        </InfoCard>
        <CodeBlock title={t.hiwS1FlowTitle}>{
`Username
    │
    ▼
Generate Private Key → Generate Public Key → Compress (SM2)
    │
    ▼
ECC Sign (License Type)
    │
    ▼
ECC Sign (Username + Data)
    │
    ▼
CRC32 Checksum → rarreg.key`
        }</CodeBlock>
      </Section>

      {/* Section 2: Galois Field */}
      <Section icon="🧮" number={2} title={t.hiwS2Title}>
        <p>{t.hiwS2P1}</p>
        <InfoCard emoji="💡" title={t.hiwS2Example}>
          <p>{t.hiwS2P2}</p>
          <CompareTable
            headers={[t.hiwS2Op, t.hiwS2Rule, t.hiwS2VD]}
            rows={[
              [t.hiwS2Add, "XOR", "0+0=0, 1+1=0"],
              [t.hiwS2Mul, "AND", "0×1=0, 1×1=1"],
            ]}
          />
        </InfoCard>
        <p>{t.hiwS2P3}</p>
      </Section>

      {/* Section 3: GF(2^15) */}
      <Section icon="📐" number={3} title={t.hiwS3Title}>
        <p>{t.hiwS3P1}</p>
        <Formula>GF(2¹⁵) = 2¹⁵ = 32,768 {t.hiwS3Elements}</Formula>
        <p>{t.hiwS3P2}</p>
        <Formula>p(α) = α¹⁵ + α + 1</Formula>
        <InfoCard emoji="🔧" title={t.hiwS3HowMul}>
          <p>{t.hiwS3P3}</p>
          <CodeBlock title="C++">
{`// Khi kết quả vượt quá 15-bit → XOR với đa thức bất khả quy
if (temp & 0x8000) {
    temp ^= 0x8003;  // x^15 + x + 1
}`}
          </CodeBlock>
        </InfoCard>
        <InfoCard emoji="⚡" title={t.hiwS3SpeedTrick}>
          <p>{t.hiwS3P4}</p>
          <Formula>A × B = Exp[Log[A] + Log[B]]</Formula>
        </InfoCard>
      </Section>

      {/* Section 4: GF((2^15)^17) */}
      <Section icon="🏗️" number={4} title={t.hiwS4Title}>
        <p>{t.hiwS4P1}</p>
        <Formula>B = b₀ + b₁·β + b₂·β² + ... + b₁₆·β¹⁶</Formula>
        <p>{t.hiwS4P2}</p>
        <Formula>15 × 17 = 255 bit</Formula>
        <p>{t.hiwS4P3}</p>
        <Formula>q(β) = β¹⁷ + β³ + 1</Formula>
        <CompareTable
          headers={[t.hiwS4OpCol, t.hiwS4HowCol]}
          rows={[
            [t.hiwS2Add, t.hiwS4AddHow],
            [t.hiwS2Mul, t.hiwS4MulHow],
            [t.hiwS4Sq, t.hiwS4SqHow],
            [t.hiwS4Inv, t.hiwS4InvHow],
          ]}
        />
        <InfoCard emoji="🔄" title={t.hiwS4Convert}>
          <p>{t.hiwS4P4}</p>
          <CodeBlock title={t.hiwS4ConvertExample}>
{`D = 0x56fd...b8cc (255 bit)

→ [0x38CC, 0x052F, 0x2510, ..., 0x56FD]
   (17 × 15-bit)`}
          </CodeBlock>
        </InfoCard>
      </Section>

      {/* Section 5: Elliptic Curve */}
      <Section icon="📈" number={5} title={t.hiwS5Title}>
        <p>{t.hiwS5P1}</p>
        <Formula>y² + xy = x³ + b</Formula>
        <InfoCard emoji="🔢" title={t.hiwS5Params}>
          <CompareTable
            headers={[t.hiwS5Param, t.hiwS5Value]}
            rows={[
              ["A", "0"],
              ["b", "161 (0xA1)"],
              [t.hiwS5Field, "GF((2¹⁵)¹⁷) — 255 bit"],
            ]}
          />
        </InfoCard>

        <h4 className="hiw-subtitle">{t.hiwS5BasePoint}</h4>
        <p>{t.hiwS5P2}</p>
        <CodeBlock title={t.hiwS5BasePointCoords}>
{`Gx = 0x56fdcbc6a27acee0cc2996e0096ae74f
     eb1acf220a2341b898b549440297b8cc

Gy = 0x20da32e8afc90b7cf0e76bde44496b4d
     0794054e6ea60f388682463132f931a7`}
        </CodeBlock>

        <h4 className="hiw-subtitle">{t.hiwS5Order}</h4>
        <p>{t.hiwS5P3}</p>
        <Formula>n = 0x1026dd85...bcd31 (241 bit)</Formula>
        <p>{t.hiwS5P4}</p>

        <InfoCard emoji="➕" title={t.hiwS5PointAdd}>
          <p>{t.hiwS5P5}</p>
          <CodeBlock title={t.hiwS5DoubleAdd}>
{`13 × G  →  13 = 1101₂

G → 2G+G=3G → 6G → 12G+G=13G
      ↑ bit=1   ↑ bit=0  ↑ bit=1`}
          </CodeBlock>
        </InfoCard>
      </Section>

      {/* Section 6: SHA-1 */}
      <Section icon="🔏" number={6} title={t.hiwS6Title}>
        <p>{t.hiwS6P1}</p>
        <InfoCard emoji="⚠️" title={t.hiwS6Diff}>
          <p>{t.hiwS6P2}</p>
          <CompareTable
            headers={["", "SHA-1", "WinRAR"]}
            rows={[
              [t.hiwS6Output, "160-bit", "240-bit"],
              [t.hiwS6Method, t.hiwS6NormalConcat, t.hiwS6ExtraHash],
            ]}
          />
        </InfoCard>
        <p>{t.hiwS6P3}</p>
        <CodeBlock title={t.hiwS6FixedValues}>
{`RawHash[5] = 0x0ffd8d43
RawHash[6] = 0xb4e33c7c
RawHash[7] = 0x53461bd1
RawHash[8] = 0x0f27a546
RawHash[9] = 0x1050d90d`}
        </CodeBlock>
      </Section>

      {/* Section 7: ECC Signature */}
      <Section icon="✍️" number={7} title={t.hiwS7Title}>
        <InfoCard emoji="🔑" title={t.hiwS7Notation}>
          <CompareTable
            headers={[t.hiwS7Symbol, t.hiwS7Meaning]}
            rows={[
              ["k", t.hiwS7PrivKey],
              ["P = k·G", t.hiwS7PubKey],
              ["h", t.hiwS7Hash],
              ["n", t.hiwS7OrderG],
            ]}
          />
        </InfoCard>

        <h4 className="hiw-subtitle">{t.hiwS7Process}</h4>
        <div className="hiw-steps-visual">
          <div className="hiw-step-v">
            <span className="hiw-step-num">1</span>
            <p>{t.hiwS7Step1}</p>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">2</span>
            <div>
              <p>{t.hiwS7Step2}</p>
              <Formula>r = (Rnd·G)ₓ + h mod n</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">3</span>
            <div>
              <p>{t.hiwS7Step3}</p>
              <Formula>s = (Rnd − k·r) mod n</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">4</span>
            <p>{t.hiwS7Step4}</p>
          </div>
        </div>

        <InfoCard emoji="🔀" title={t.hiwS7Compare}>
          <CompareTable
            headers={["", "ECDSA", "WinRAR (SM2)"]  }
            rows={[
              ["r", "r = (Rnd·G)ₓ mod n", "r = (Rnd·G)ₓ + h mod n"],
              ["s", "s = Rnd⁻¹(h+k·r) mod n", "s = (Rnd−k·r) mod n"],
            ]}
          />
        </InfoCard>
      </Section>

      {/* Section 8: Private Key Generation */}
      <Section icon="🏭" number={8} title={t.hiwS8Title}>
        <p>{t.hiwS8P1}</p>
        <div className="hiw-steps-visual">
          <div className="hiw-step-v">
            <span className="hiw-step-num">1</span>
            <p>{t.hiwS8Step1}</p>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">2</span>
            <div>
              <p>{t.hiwS8Step2}</p>
              <CodeBlock>
{`g₁ = 0xeb3eb781    g₂ = 0x50265329
g₃ = 0xdc5ef4a3    g₄ = 0x6847b9d5
g₅ = 0xcde43b4c`}
              </CodeBlock>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">3</span>
            <div>
              <p>{t.hiwS8Step3}</p>
              <Formula>SHA1([counter, g₁...g₅]) → 16-bit</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">4</span>
            <div>
              <p>{t.hiwS8Step4}</p>
              <Formula>k = Kg₁ + Kg₂·2¹⁶ + ... + Kg₁₅·2²²⁴</Formula>
            </div>
          </div>
        </div>
        <InfoCard emoji="⚠️" title={t.hiwS8Warning}>
          <p>{t.hiwS8P2}</p>
        </InfoCard>
      </Section>

      {/* Section 9: WinRAR Keys */}
      <Section icon="🗝️" number={9} title={t.hiwS9Title}>
        <p>{t.hiwS9P1}</p>
        <CodeBlock title={t.hiwS9PrivKey}>
{`k = 0x59fe6abcca90bdb95f0105271fa85fb9
    f11f467450c1ae9044b7fd61d65e`}
        </CodeBlock>
        <InfoCard emoji="💡" title={t.hiwS9Why}>
          <p>{t.hiwS9P2}</p>
        </InfoCard>
      </Section>

      {/* Section 10: rarreg.key Generation */}
      <Section icon="📝" number={10} title={t.hiwS10Title}>
        <p>{t.hiwS10P1}</p>
        <div className="hiw-steps-visual">
          <div className="hiw-step-v">
            <span className="hiw-step-num">1</span>
            <div>
              <p>{t.hiwS10Step1}</p>
              <Formula>PrivKey(Username) → PubKey → SM2Compress → Temp (64 hex)</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">2</span>
            <p>{t.hiwS10Step2}</p>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">3</span>
            <p>{t.hiwS10Step3}</p>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">4</span>
            <p>{t.hiwS10Step4}</p>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">5</span>
            <div>
              <p>{t.hiwS10Step5}</p>
              <Formula>Sign(LicenseType) → (r, s) ≤ 240 bit</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">6</span>
            <div>
              <p>{t.hiwS10Step6}</p>
              <Formula>Sign(Username + Data0) → (r, s)</Formula>
            </div>
          </div>
          <div className="hiw-step-v">
            <span className="hiw-step-num">7</span>
            <p>{t.hiwS10Step7}</p>
          </div>
        </div>

        <InfoCard emoji="📄" title={t.hiwS10Output}>
          <CodeBlock>
{`RAR registration data
wrkg
Single PC usage license
UID=abcdef1234567890abcd
<Data, 54 chars/line>
...`}
          </CodeBlock>
        </InfoCard>
      </Section>

      {/* Section 11: RAR Archive Creation */}
      <Section icon="📦" number={11} title={t.hiwS13Title}>
        <p className="hiw-paragraph">{t.hiwS13P1}</p>

        <InfoCard emoji="⚙️" title={t.hiwS13How}>
          <ol className="hiw-reason-list">
            <li>{t.hiwS13Step1}</li>
            <li>{t.hiwS13Step2}</li>
            <li>{t.hiwS13Step3}</li>
            <li>{t.hiwS13Step4}</li>
            <li>{t.hiwS13Step5}</li>
            <li>{t.hiwS13Step6}</li>
          </ol>
        </InfoCard>

        <InfoCard emoji="❓" title={t.hiwS13WhyRar}>
          <ol className="hiw-reason-list">
            <li>{t.hiwS13Reason1}</li>
            <li>{t.hiwS13Reason2}</li>
            <li>{t.hiwS13Reason3}</li>
          </ol>
        </InfoCard>

        <InfoCard emoji="🗂️" title={t.hiwS13Structure}>
          <CompareTable
            headers={[t.hiwS13Block, t.hiwS13Size, t.hiwS13Purpose]}
            rows={[
              [t.hiwS13Signature, "7 bytes", t.hiwS13SigDesc],
              [t.hiwS13ArchiveHdr, "13 bytes", t.hiwS13ArchiveHdrDesc],
              [t.hiwS13FileHdr, "~40+ bytes", t.hiwS13FileHdrDesc],
              [t.hiwS13FileData, "variable", t.hiwS13FileDataDesc],
            ]}
          />
        </InfoCard>
      </Section>

      {/* Section 12: Summary */}
      <Section icon="🎯" number={12} title={t.hiwS11Title}>
        <CompareTable
          headers={[t.hiwS11Component, t.hiwS11Desc]}
          rows={[
            [t.hiwS11Field, "GF((2¹⁵)¹⁷) — 255 bit"],
            [t.hiwS11Curve, "y² + xy = x³ + 161"],
            [t.hiwS11BasePoint, t.hiwS11BasePointV],
            [t.hiwS11OrderN, "241 bit"],
            ["Private Key", "240 bit, " + t.hiwS11FixedSeed],
            ["Public Key", "P = k·G"],
            ["Hash", "SHA-1 " + t.hiwS11Variant + " (240 bit)"],
            [t.hiwS11Sig, "ECDSA: (r, s) ≤ 240 bit"],
            ["Checksum", "CRC32 ~"],
          ]}
        />

        <InfoCard emoji="🧩" title={t.hiwS11Why}>
          <ol className="hiw-reason-list">
            <li>{t.hiwS11Reason1}</li>
            <li>{t.hiwS11Reason2}</li>
            <li>{t.hiwS11Reason3}</li>
          </ol>
        </InfoCard>
      </Section>

      {/* Section 13: Glossary */}
      <Section icon="📖" number={13} title={t.hiwS12Title}>
        <CompareTable
          headers={[t.hiwS12En, t.hiwS12Local, t.hiwS12Explain]}
          rows={[
            ["Galois Field (GF)", t.hiwS12GF, t.hiwS12GFDesc],
            ["Irreducible Polynomial", t.hiwS12Irr, t.hiwS12IrrDesc],
            ["Elliptic Curve", t.hiwS12EC, t.hiwS12ECDesc],
            ["Base Point (G)", t.hiwS12BP, t.hiwS12BPDesc],
            ["Private Key", t.hiwS12PK, t.hiwS12PKDesc],
            ["Public Key", t.hiwS12PubK, t.hiwS12PubKDesc],
            ["Digital Signature", t.hiwS12DS, t.hiwS12DSDesc],
            ["XOR (⊕)", t.hiwS12XOR, t.hiwS12XORDesc],
            ["ECDSA", t.hiwS12ECDS, t.hiwS12ECDSDesc],
          ]}
        />
      </Section>
    </div>
  );
}
