import { useState, useCallback } from "react";
import type { RegisterInfo } from "../crypto/WinRarKeygen";
import {
  generateRegisterInfo,
  buildRegFileContent,
} from "../crypto/WinRarKeygen";
import { Encoding, preprocessStrings, getEncoder } from "../crypto/Encoding";
import { buildRar4Archive } from "../crypto/RarArchive";
import { useI18n } from "../i18n";
import UsageGuide from "./UsageGuide";

type ExportFormat = "key" | "rar";

export default function KeygenForm() {
  const { t } = useI18n();
  const [userName, setUserName] = useState("wrkg");
  const [licenseType, setLicenseType] = useState("Single PC usage license");
  const [encoding, setEncoding] = useState<Encoding>(Encoding.UTF8);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("key");
  const [result, setResult] = useState<RegisterInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    setError(null);
    setResult(null);
    setCopied(false);

    if (!userName.trim() || !licenseType.trim()) {
      setError(t.errEmpty);
      return;
    }
    if (userName.length > 200 || licenseType.length > 200) {
      setError(t.errTooLong);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const { displayUser, displayLicense } = preprocessStrings(
          userName.trim(),
          licenseType.trim(),
          encoding
        );
        const encoder = getEncoder(encoding);
        const info = generateRegisterInfo(displayUser, displayLicense, encoder);
        setResult(info);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [userName, licenseType, encoding, t]);

  const handleDownloadKey = useCallback(() => {
    if (!result) return;
    const content = buildRegFileContent(result);
    const blob = new Blob([content], { type: "text/plain" });
    downloadBlob(blob, "rarreg.key");
  }, [result]);

  const handleDownloadRar = useCallback(() => {
    if (!result) return;
    const content = buildRegFileContent(result);
    const encoder = new TextEncoder();
    const fileData = encoder.encode(content);
    const rar = buildRar4Archive("rarreg.key", fileData);
    const blob = new Blob([rar.buffer as ArrayBuffer], { type: "application/x-rar-compressed" });
    downloadBlob(blob, "rarkey.rar");
  }, [result]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    const content = buildRegFileContent(result);
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    <div className="card">
      <p className="subtitle">{t.appSubtitle}</p>

      {/* Username */}
      <div className="field">
        <label htmlFor="username">{t.labelUsername}</label>
        <input
          id="username"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* License Name */}
      <div className="field">
        <label htmlFor="license">{t.labelLicense}</label>
        <input
          id="license"
          type="text"
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          maxLength={200}
        />
      </div>

      {/* Encoding + Export Format side by side */}
      <div className="field-row">
        <div className="field field--half">
          <label>{t.labelEncoding}</label>
          <div className="seg-control">
            {([
              { value: Encoding.UTF8 as Encoding, label: t.encodingUtf8 },
              { value: Encoding.ASCII as Encoding, label: t.encodingAscii },
              { value: Encoding.ANSI as Encoding, label: t.encodingAnsi },
            ]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`seg-btn${encoding === opt.value ? " active" : ""}`}
                onClick={() => setEncoding(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="hint">
            {encoding === Encoding.UTF8 && t.hintUtf8}
            {encoding === Encoding.ASCII && t.hintAscii}
            {encoding === Encoding.ANSI && t.hintAnsi}
          </span>
        </div>

        <div className="field field--half">
          <label>{t.labelExportFormat}</label>
          <div className="seg-control">
            <button
              type="button"
              className={`seg-btn${exportFormat === "key" ? " active" : ""}`}
              onClick={() => setExportFormat("key")}
            >
              {t.exportKey}
            </button>
            <button
              type="button"
              className={`seg-btn${exportFormat === "rar" ? " active" : ""}`}
              onClick={() => setExportFormat("rar")}
            >
              {t.exportRar}
            </button>
          </div>
          <span className="hint">
            {exportFormat === "key" ? t.exportKeyDesc : t.exportRarDesc}
          </span>
        </div>
      </div>

      {/* Generate */}
      <button className="btn-primary" onClick={handleGenerate} disabled={loading}>
        {loading ? t.btnGenerating : t.btnGenerate}
      </button>

      {/* Error */}
      {error && <div className="alert alert--error">{error}</div>}

      {/* Usage Guide */}
      <UsageGuide />

      {/* Result */}
      {result && (
        <div className="result">
          <h2 className="result-title">{t.resultTitle}</h2>
          <pre className="result-pre">
            {`RAR registration data\n${result.userName}\n${result.licenseType}\nUID=${result.uid}\n${result.hexData.match(/.{1,54}/g)?.join("\n") ?? result.hexData}`}
          </pre>

          <div className="action-row">
            <button
              className="btn-outline"
              onClick={exportFormat === "rar" ? handleDownloadRar : handleDownloadKey}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {exportFormat === "rar" ? t.btnDownloadRar : t.btnDownloadKey}
            </button>
            <button className="btn-outline" onClick={handleCopy}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                {copied ? (
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                ) : (
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z M6 3a3 3 0 00-3 3v8a3 3 0 003 3h4a3 3 0 003-3V6a3 3 0 00-3-3H6z" />
                )}
              </svg>
              {copied ? t.btnCopied : t.btnCopy}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
