import { useState } from "react";
import { useI18n } from "../i18n";

export default function UsageGuide() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <section className="guide-section">
      <button
        className="guide-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <svg className="guide-toggle-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        {open ? t.guideToggleHide : t.guideToggleShow}
        <svg
          className={`guide-chevron ${open ? "guide-chevron-open" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          width="14"
          height="14"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="guide-content">
          <h3 className="guide-title">{t.guideTitle}</h3>

          <div className="guide-step">
            <h4>{t.guideStep1Title}</h4>
            <p>{t.guideStep1Desc}</p>
          </div>

          <div className="guide-step">
            <h4>{t.guideStep2Title}</h4>
            <p>{t.guideStep2Desc}</p>
          </div>

          <div className="guide-step">
            <h4>{t.guideStep3Title}</h4>
            <p>{t.guideStep3Desc}</p>
            <ul className="guide-list">
              <li><code>rarreg.key</code> {t.guideStep3OptionKey.replace("rarreg.key ", "")}</li>
              <li><code>rarkey.rar</code> {t.guideStep3OptionRar.replace("rarkey.rar ", "")}</li>
            </ul>
          </div>

          <div className="guide-step">
            <h4>{t.guideStep4Title}</h4>
            <p>{t.guideStep4Desc}</p>
            <ul className="guide-list">
              <li>{t.guideStep4MethodKey}</li>
              <li>{t.guideStep4MethodRar}</li>
              <li>{t.guideStep4AltPath}</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
