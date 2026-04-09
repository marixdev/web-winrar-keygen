import { useState, useEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { hiwTranslations } from "../i18n-hiw";

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.unobserve(el); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

/* ═══════════════════════════════════════════════════════
   BUILDING BLOCKS
   ═══════════════════════════════════════════════════════ */

const SECTION_HUES = [
  "210", "270", "170", "330", "200", "30", "290", "150", "350", "190", "50", "240", "140",
];

/* Timeline node — the main chapter wrapper */
interface NodeProps {
  num: number;
  icon: string;
  title: string;
  children: React.ReactNode;
  accent?: string;
}

function TimelineNode({ num, icon, title, children, accent }: NodeProps) {
  const { ref, vis } = useReveal();
  const side = num % 2 === 1 ? "left" : "right";
  const hue = accent ?? SECTION_HUES[(num - 1) % SECTION_HUES.length];

  return (
    <div
      ref={ref}
      className={`ig-node ig-node--${side} ${vis ? "ig-node--vis" : ""}`}
      style={{ "--hue": hue } as React.CSSProperties}
    >
      {/* Connector dot on the timeline */}
      <div className="ig-dot">
        <span className="ig-dot-icon">{icon}</span>
      </div>

      {/* The card */}
      <div className="ig-card">
        {/* Giant watermark number */}
        <span className="ig-watermark">{String(num).padStart(2, "0")}</span>

        <div className="ig-card-head">
          <span className="ig-badge">{String(num).padStart(2, "0")}</span>
          <h3 className="ig-card-title">{title}</h3>
        </div>

        <div className="ig-card-body">{children}</div>
      </div>
    </div>
  );
}

/* Stat callout — big bold number */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ig-stat">
      <div className="ig-stat-value">{value}</div>
      <div className="ig-stat-label">{label}</div>
    </div>
  );
}

function StatRow({ children }: { children: React.ReactNode }) {
  return <div className="ig-stat-row">{children}</div>;
}

/* Inline formula */
function Formula({ children }: { children: React.ReactNode }) {
  return <div className="ig-formula">{children}</div>;
}

/* Terminal-style code block */
function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="ig-terminal">
      <div className="ig-terminal-bar">
        <span className="ig-terminal-dots">
          <i style={{ background: "#ff5f56" }} />
          <i style={{ background: "#ffbd2e" }} />
          <i style={{ background: "#27c93f" }} />
        </span>
        {title && <span className="ig-terminal-title">{title}</span>}
      </div>
      <pre className="ig-terminal-code">{children}</pre>
    </div>
  );
}

/* Callout card */
function Callout({ icon, title, children, variant = "info" }: {
  icon: string; title: string; children: React.ReactNode;
  variant?: "info" | "warn" | "tip";
}) {
  return (
    <div className={`ig-callout ig-callout--${variant}`}>
      <div className="ig-callout-head">
        <span>{icon}</span>
        <strong>{title}</strong>
      </div>
      <div className="ig-callout-body">{children}</div>
    </div>
  );
}

/* Data table */
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="ig-table-wrap">
      <table className="ig-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Step list with connected dots */
function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <div className="ig-steps">
      {items.map((item, i) => (
        <div className="ig-step" key={i}>
          <div className="ig-step-num">{i + 1}</div>
          <div className="ig-step-content">{item}</div>
        </div>
      ))}
    </div>
  );
}

/* Flip card for glossary */
function FlipCard({ front, back, detail }: { front: string; back: string; detail: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`ig-flip ${flipped ? "ig-flip--flipped" : ""}`} onClick={() => setFlipped(v => !v)}>
      <div className="ig-flip-inner">
        <div className="ig-flip-front">
          <span className="ig-flip-term">{front}</span>
          <span className="ig-flip-local">{back}</span>
        </div>
        <div className="ig-flip-back">
          <p>{detail}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function HowItWorks() {
  const { lang } = useI18n();
  const t = hiwTranslations[lang] ?? hiwTranslations.en;

  return (
    <div className="ig-container">

      {/* ── HERO ── */}
      <div className="ig-hero">
        <div className="ig-hero-bg" />
        <div className="ig-hero-content">
          <div className="ig-hero-icon">🔐</div>
          <h1 className="ig-hero-title">{t.hiwTitle}</h1>
          <p className="ig-hero-sub">{t.hiwSubtitle}</p>
        </div>

        {/* Pipeline flow */}
        <div className="ig-pipeline">
          {[
            { icon: "👤", label: t.hiwFlowUser },
            { icon: "🔑", label: t.hiwFlowKey },
            { icon: "✍️", label: t.hiwFlowSign },
            { icon: "📄", label: "rarreg.key" },
          ].map((s, i, a) => (
            <div key={i} className="ig-pipe-group">
              <div className="ig-pipe-node">
                <div className="ig-pipe-icon">{s.icon}</div>
                <div className="ig-pipe-label">{s.label}</div>
              </div>
              {i < a.length - 1 && (
                <div className="ig-pipe-connector">
                  <svg viewBox="0 0 40 12" className="ig-pipe-svg">
                    <line x1="0" y1="6" x2="30" y2="6" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                    <polygon points="30,2 38,6 30,10" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="ig-timeline">
        <div className="ig-timeline-line" />

        {/* 1 — Overview */}
        <TimelineNode num={1} icon="🌐" title={t.hiwS1Title}>
          <p>{t.hiwS1P1}</p>
          <Callout icon="⚡" title={t.hiwS1KeyPoint}>
            <p>{t.hiwS1P2}</p>
          </Callout>
          <CodeBlock title={t.hiwS1FlowTitle}>{
`Username
    │
    ▼
Generate Private Key → Public Key → Compress
    │
    ▼
ECC Sign (License Type)
    │
    ▼
ECC Sign (Username + Data)
    │
    ▼
CRC32 Checksum → rarreg.key`}</CodeBlock>
        </TimelineNode>

        {/* 2 — Galois Field */}
        <TimelineNode num={2} icon="🧮" title={t.hiwS2Title}>
          <p>{t.hiwS2P1}</p>
          <Callout icon="💡" title={t.hiwS2Example}>
            <p>{t.hiwS2P2}</p>
            <DataTable
              headers={[t.hiwS2Op, t.hiwS2Rule, t.hiwS2VD]}
              rows={[
                [t.hiwS2Add, "XOR", "0+0=0, 1+1=0"],
                [t.hiwS2Mul, "AND", "0×1=0, 1×1=1"],
              ]}
            />
          </Callout>
          <p>{t.hiwS2P3}</p>
        </TimelineNode>

        {/* 3 — GF(2^15) */}
        <TimelineNode num={3} icon="📐" title={t.hiwS3Title}>
          <p>{t.hiwS3P1}</p>
          <StatRow>
            <Stat value="2¹⁵" label={t.hiwS3Elements} />
            <Stat value="32,768" label="0x0000 – 0x7FFF" />
            <Stat value="15-bit" label="polynomial" />
          </StatRow>
          <Formula>p(α) = α¹⁵ + α + 1</Formula>
          <Callout icon="🔧" title={t.hiwS3HowMul}>
            <p>{t.hiwS3P3}</p>
            <CodeBlock title="Reduction">{`if (temp & 0x8000) {
    temp ^= 0x8003;  // x^15 + x + 1
}`}</CodeBlock>
          </Callout>
          <Callout icon="⚡" title={t.hiwS3SpeedTrick} variant="tip">
            <p>{t.hiwS3P4}</p>
            <Formula>A × B = Exp[Log[A] + Log[B]]</Formula>
          </Callout>
        </TimelineNode>

        {/* 4 — GF((2^15)^17) */}
        <TimelineNode num={4} icon="🏗️" title={t.hiwS4Title}>
          <p>{t.hiwS4P1}</p>
          <Formula>B = b₀ + b₁·β + b₂·β² + ... + b₁₆·β¹⁶</Formula>
          <StatRow>
            <Stat value="15 × 17" label="= 255 bit" />
            <Stat value="17" label="coefficients" />
          </StatRow>
          <Formula>q(β) = β¹⁷ + β³ + 1</Formula>
          <DataTable
            headers={[t.hiwS4OpCol, t.hiwS4HowCol]}
            rows={[
              [t.hiwS2Add, t.hiwS4AddHow],
              [t.hiwS2Mul, t.hiwS4MulHow],
              [t.hiwS4Sq, t.hiwS4SqHow],
              [t.hiwS4Inv, t.hiwS4InvHow],
            ]}
          />
          <Callout icon="🔄" title={t.hiwS4Convert}>
            <p>{t.hiwS4P4}</p>
            <CodeBlock title={t.hiwS4ConvertExample}>{`D = 0x56fd...b8cc (255 bit)

→ [0x38CC, 0x052F, 0x2510, ..., 0x56FD]
   (17 × 15-bit)`}</CodeBlock>
          </Callout>
        </TimelineNode>

        {/* 5 — Elliptic Curve */}
        <TimelineNode num={5} icon="📈" title={t.hiwS5Title}>
          <p>{t.hiwS5P1}</p>
          <Formula>y² + xy = x³ + b</Formula>
          <DataTable
            headers={[t.hiwS5Param, t.hiwS5Value]}
            rows={[
              ["A", "0"],
              ["b", "161 (0xA1)"],
              [t.hiwS5Field, "GF((2¹⁵)¹⁷) — 255 bit"],
            ]}
          />
          <h4 className="ig-label">{t.hiwS5BasePoint}</h4>
          <p>{t.hiwS5P2}</p>
          <CodeBlock title={t.hiwS5BasePointCoords}>{`Gx = 0x56fdcbc6a27acee0cc2996e0096ae74f
     eb1acf220a2341b898b549440297b8cc

Gy = 0x20da32e8afc90b7cf0e76bde44496b4d
     0794054e6ea60f388682463132f931a7`}</CodeBlock>
          <StatRow>
            <Stat value="241-bit" label={`${t.hiwS5Order} n`} />
            <Stat value="255-bit" label="coordinates" />
          </StatRow>
          <Callout icon="➕" title={t.hiwS5PointAdd}>
            <p>{t.hiwS5P5}</p>
            <CodeBlock title={t.hiwS5DoubleAdd}>{`13 × G  →  13 = 1101₂

G → 2G+G=3G → 6G → 12G+G=13G
      ↑ bit=1   ↑ bit=0  ↑ bit=1`}</CodeBlock>
          </Callout>
        </TimelineNode>

        {/* 6 — SHA-1 */}
        <TimelineNode num={6} icon="🔏" title={t.hiwS6Title}>
          <p>{t.hiwS6P1}</p>
          <Callout icon="⚠️" title={t.hiwS6Diff} variant="warn">
            <p>{t.hiwS6P2}</p>
            <DataTable
              headers={["", "SHA-1", "WinRAR"]}
              rows={[
                [t.hiwS6Output, "160-bit", "240-bit"],
                [t.hiwS6Method, t.hiwS6NormalConcat, t.hiwS6ExtraHash],
              ]}
            />
          </Callout>
          <StatRow>
            <Stat value="160→240" label="bits extended" />
            <Stat value="+5" label="fixed values" />
          </StatRow>
          <CodeBlock title={t.hiwS6FixedValues}>{`RawHash[5] = 0x0ffd8d43
RawHash[6] = 0xb4e33c7c
RawHash[7] = 0x53461bd1
RawHash[8] = 0x0f27a546
RawHash[9] = 0x1050d90d`}</CodeBlock>
        </TimelineNode>

        {/* 7 — ECC Signature */}
        <TimelineNode num={7} icon="✍️" title={t.hiwS7Title}>
          <DataTable
            headers={[t.hiwS7Symbol, t.hiwS7Meaning]}
            rows={[
              ["k", t.hiwS7PrivKey],
              ["P = k·G", t.hiwS7PubKey],
              ["h", t.hiwS7Hash],
              ["n", t.hiwS7OrderG],
            ]}
          />
          <h4 className="ig-label">{t.hiwS7Process}</h4>
          <Steps items={[
            <span>{t.hiwS7Step1}</span>,
            <span>{t.hiwS7Step2}<Formula>r = (Rnd·G)ₓ + h mod n</Formula></span>,
            <span>{t.hiwS7Step3}<Formula>s = (Rnd − k·r) mod n</Formula></span>,
            <span>{t.hiwS7Step4}</span>,
          ]} />
          <Callout icon="🔀" title={t.hiwS7Compare}>
            <DataTable
              headers={["", "ECDSA", "WinRAR (SM2)"]}
              rows={[
                ["r", "r = (Rnd·G)ₓ mod n", "r = (Rnd·G)ₓ + h mod n"],
                ["s", "s = Rnd⁻¹(h+k·r) mod n", "s = (Rnd−k·r) mod n"],
              ]}
            />
          </Callout>
        </TimelineNode>

        {/* 8 — Private Key Generation */}
        <TimelineNode num={8} icon="🏭" title={t.hiwS8Title}>
          <p>{t.hiwS8P1}</p>
          <Steps items={[
            <span>{t.hiwS8Step1}</span>,
            <span>{t.hiwS8Step2}
              <CodeBlock>{`g₁ = 0xeb3eb781    g₂ = 0x50265329
g₃ = 0xdc5ef4a3    g₄ = 0x6847b9d5
g₅ = 0xcde43b4c`}</CodeBlock>
            </span>,
            <span>{t.hiwS8Step3}<Formula>SHA1([counter, g₁...g₅]) → 16-bit</Formula></span>,
            <span>{t.hiwS8Step4}<Formula>k = Kg₁ + Kg₂·2¹⁶ + ... + Kg₁₅·2²²⁴</Formula></span>,
          ]} />
          <Callout icon="⚠️" title={t.hiwS8Warning} variant="warn">
            <p>{t.hiwS8P2}</p>
          </Callout>
        </TimelineNode>

        {/* 9 — WinRAR Keys */}
        <TimelineNode num={9} icon="🗝️" title={t.hiwS9Title}>
          <p>{t.hiwS9P1}</p>
          <CodeBlock title={t.hiwS9PrivKey}>{`k = 0x59fe6abcca90bdb95f0105271fa85fb9
    f11f467450c1ae9044b7fd61d65e`}</CodeBlock>
          <StatRow>
            <Stat value="240-bit" label="private key" />
            <Stat value="fixed" label="deterministic" />
          </StatRow>
          <Callout icon="💡" title={t.hiwS9Why} variant="tip">
            <p>{t.hiwS9P2}</p>
          </Callout>
        </TimelineNode>

        {/* 10 — rarreg.key Generation */}
        <TimelineNode num={10} icon="📝" title={t.hiwS10Title}>
          <p>{t.hiwS10P1}</p>
          <Steps items={[
            <span>{t.hiwS10Step1}<Formula>PrivKey → PubKey → Compress → Temp (64 hex)</Formula></span>,
            <span>{t.hiwS10Step2}</span>,
            <span>{t.hiwS10Step3}</span>,
            <span>{t.hiwS10Step4}</span>,
            <span>{t.hiwS10Step5}<Formula>Sign(LicenseType) → (r, s) ≤ 240 bit</Formula></span>,
            <span>{t.hiwS10Step6}<Formula>Sign(Username + Data0) → (r, s)</Formula></span>,
            <span>{t.hiwS10Step7}</span>,
          ]} />
          <Callout icon="📄" title={t.hiwS10Output}>
            <CodeBlock>{`RAR registration data
wrkg
Single PC usage license
UID=abcdef1234567890abcd
<Data, 54 chars/line>
...`}</CodeBlock>
          </Callout>
        </TimelineNode>

        {/* 11 — RAR Archive Creation */}
        <TimelineNode num={11} icon="📦" title={t.hiwS13Title}>
          <p>{t.hiwS13P1}</p>
          <Steps items={[
            <span>{t.hiwS13Step1}</span>,
            <span>{t.hiwS13Step2}</span>,
            <span>{t.hiwS13Step3}</span>,
            <span>{t.hiwS13Step4}</span>,
            <span>{t.hiwS13Step5}</span>,
            <span>{t.hiwS13Step6}</span>,
          ]} />
          <Callout icon="❓" title={t.hiwS13WhyRar}>
            <ol className="ig-list">
              <li>{t.hiwS13Reason1}</li>
              <li>{t.hiwS13Reason2}</li>
              <li>{t.hiwS13Reason3}</li>
            </ol>
          </Callout>
          <DataTable
            headers={[t.hiwS13Block, t.hiwS13Size, t.hiwS13Purpose]}
            rows={[
              [t.hiwS13Signature, "7 bytes", t.hiwS13SigDesc],
              [t.hiwS13ArchiveHdr, "13 bytes", t.hiwS13ArchiveHdrDesc],
              [t.hiwS13FileHdr, "~40+ bytes", t.hiwS13FileHdrDesc],
              [t.hiwS13FileData, "variable", t.hiwS13FileDataDesc],
            ]}
          />
        </TimelineNode>

        {/* 12 — Summary */}
        <TimelineNode num={12} icon="🎯" title={t.hiwS11Title}>
          <DataTable
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
          <Callout icon="🧩" title={t.hiwS11Why} variant="tip">
            <ol className="ig-list">
              <li>{t.hiwS11Reason1}</li>
              <li>{t.hiwS11Reason2}</li>
              <li>{t.hiwS11Reason3}</li>
            </ol>
          </Callout>
        </TimelineNode>

        {/* 13 — Glossary (flip cards) */}
        <TimelineNode num={13} icon="📖" title={t.hiwS12Title}>
          <p style={{ fontSize: ".78rem", color: "var(--text-dim)", marginBottom: ".75rem" }}>
            👆 Tap a card to flip
          </p>
          <div className="ig-flip-grid">
            {([
              ["Galois Field", t.hiwS12GF, t.hiwS12GFDesc],
              ["Irreducible Poly", t.hiwS12Irr, t.hiwS12IrrDesc],
              ["Elliptic Curve", t.hiwS12EC, t.hiwS12ECDesc],
              ["Base Point (G)", t.hiwS12BP, t.hiwS12BPDesc],
              ["Private Key", t.hiwS12PK, t.hiwS12PKDesc],
              ["Public Key", t.hiwS12PubK, t.hiwS12PubKDesc],
              ["Digital Signature", t.hiwS12DS, t.hiwS12DSDesc],
              ["XOR (⊕)", t.hiwS12XOR, t.hiwS12XORDesc],
              ["ECDSA", t.hiwS12ECDS, t.hiwS12ECDSDesc],
            ] as [string, string, string][]).map(([en, local, desc], i) => (
              <FlipCard key={i} front={en} back={local} detail={desc} />
            ))}
          </div>
        </TimelineNode>

      </div>
    </div>
  );
}
