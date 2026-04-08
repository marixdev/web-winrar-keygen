import { useState, useRef, useEffect } from "react";
import { useI18n, LANGUAGES } from "../i18n";

/** Flag image URL from flagcdn.com CDN */
function flagUrl(countryCode: string, size = 40) {
  return `https://flagcdn.com/w${size}/${countryCode}.png`;
}

export default function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div className="lang-selector" ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen(!open)}
        title={t.labelLanguage}
      >
        <img
          className="lang-current-flag"
          src={flagUrl(current.flag)}
          alt={current.name}
          width="20"
          height="15"
        />
        <svg className={`lang-chevron${open ? " open" : ""}`} viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="lang-dropdown">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              className={`lang-option${lang === l.code ? " active" : ""}`}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
            >
              <img
                className="lang-option-flag"
                src={flagUrl(l.flag)}
                alt={l.name}
                width="20"
                height="15"
              />
              <span className="lang-option-name">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
