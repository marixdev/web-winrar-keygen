import { useState, useEffect, useCallback } from "react";
import KeygenForm from "./components/KeygenForm";
import LanguageSelector from "./components/LanguageSelector";
import ThemeToggle from "./components/ThemeToggle";
import VisitCounter from "./components/VisitCounter";
import type { LangCode } from "./i18n";
import { translations, I18nContext } from "./i18n";
import type { Theme } from "./theme";
import { ThemeContext } from "./theme";
import "./App.css";

/** Map country code from IP API to our supported LangCode */
function countryToLang(cc: string, languages: string): LangCode | null {
  const map: Record<string, LangCode> = {
    vn: "vi", us: "en", gb: "en", au: "en", ca: "en", nz: "en",
    id: "id", cn: "zh", tw: "zh", hk: "zh", sg: "zh",
    kr: "ko", jp: "ja", fr: "fr", de: "de", at: "de", ch: "de",
    es: "es", mx: "es", ar: "es", co: "es", cl: "es", pe: "es",
    th: "th", my: "ms", bn: "ms", ru: "ru", ua: "ru",
    ph: "fil", br: "pt", pt: "pt", ao: "pt", mz: "pt",
  };
  if (map[cc]) return map[cc];
  // Fallback: check first language in the languages CSV
  const first = languages.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("vi")) return "vi";
  if (first.startsWith("zh")) return "zh";
  if (first.startsWith("ko")) return "ko";
  if (first.startsWith("ja")) return "ja";
  if (first.startsWith("fr")) return "fr";
  if (first.startsWith("de")) return "de";
  if (first.startsWith("es")) return "es";
  if (first.startsWith("th")) return "th";
  if (first.startsWith("ms")) return "ms";
  if (first.startsWith("ru")) return "ru";
  if (first.startsWith("fil") || first.startsWith("tl")) return "fil";
  if (first.startsWith("pt")) return "pt";
  if (first.startsWith("id")) return "id";
  return null;
}

/** Browser language fallback */
function detectBrowserLang(): LangCode {
  const nav = navigator.language.toLowerCase();
  const pairs: [string, LangCode][] = [
    ["vi", "vi"], ["zh", "zh"], ["ko", "ko"], ["ja", "ja"],
    ["fr", "fr"], ["de", "de"], ["es", "es"], ["th", "th"],
    ["ms", "ms"], ["ru", "ru"], ["fil", "fil"], ["tl", "fil"],
    ["pt", "pt"], ["id", "id"],
  ];
  for (const [prefix, code] of pairs) {
    if (nav.startsWith(prefix)) return code;
  }
  return "en";
}

function App() {
  const [lang, setLang] = useState<LangCode>(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved in translations) return saved as LangCode;
    // Fallback to browser language until IP detection resolves
    return detectBrowserLang();
  });

  // Auto-detect language from IP geolocation (runs once)
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) return; // User already chose a language
    const controller = new AbortController();

    // Use multiple providers with fallback chain
    async function detectCountry(signal: AbortSignal): Promise<string | null> {
      // 1) Cloudflare cdn-cgi/trace — works everywhere, no CORS issues
      try {
        const r = await fetch("https://www.cloudflare.com/cdn-cgi/trace", { signal });
        const text = await r.text();
        const match = text.match(/loc=(\w{2})/);
        if (match) return match[1].toLowerCase();
      } catch { /* try next */ }

      // 2) ip-api.com (free, no key needed)
      try {
        const r = await fetch("http://ip-api.com/json/?fields=countryCode", { signal });
        const data = await r.json() as { countryCode?: string };
        if (data.countryCode) return data.countryCode.toLowerCase();
      } catch { /* try next */ }

      // 3) ipapi.co (original, can hit rate limits)
      try {
        const r = await fetch("https://ipapi.co/json/", { signal });
        const data = await r.json() as { country_code?: string; languages?: string };
        if (data.country_code) return data.country_code.toLowerCase();
      } catch { /* give up */ }

      return null;
    }

    detectCountry(controller.signal).then((cc) => {
      if (cc) {
        const mapped = countryToLang(cc, "");
        if (mapped && mapped in translations) {
          setLang(mapped);
        }
      }
    });
    return () => controller.abort();
  }, []);

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const t = translations[lang];

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="app-shell">
          <header className="top-bar">
            <div className="top-bar-inner">
              <div className="brand">
                <img className="brand-icon" src="/winrar-icon.png" alt="WinRAR" />
                <span className="brand-text">{t.appTitle}</span>
                <span className="brand-badge">{t.appBadge}</span>
              </div>
              <div className="top-bar-actions">
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="main-content">
            <KeygenForm />
          </main>
          <footer className="app-footer">
            <p>{t.footerText}</p>
            <p className="copyright">Made with ❤️ by <a href="https://github.com/marixdev" target="_blank" rel="noopener noreferrer">marixdev</a></p>
            <VisitCounter />
          </footer>
        </div>
      </ThemeContext.Provider>
    </I18nContext.Provider>
  );
}

export default App;
