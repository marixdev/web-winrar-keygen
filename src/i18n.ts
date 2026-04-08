/**
 * Internationalization system.
 * Supports 14 languages: EN, VN, ID, CN, KR, JP, FR, DE, ES, TH, MY, RU, PH, BR
 */

import { createContext, useContext } from "react";

export type LangCode =
  | "en" | "vi" | "id" | "zh" | "ko"
  | "ja" | "fr" | "de" | "es" | "th"
  | "ms" | "ru" | "fil" | "pt";

export interface Translation {
  // Meta
  langName: string;
  langFlag: string;

  // Header
  appTitle: string;
  appBadge: string;
  appSubtitle: string;

  // Form labels
  labelUsername: string;
  labelLicense: string;
  labelEncoding: string;
  labelExportFormat: string;

  // Encoding
  encodingUtf8: string;
  encodingAscii: string;
  encodingAnsi: string;
  hintUtf8: string;
  hintAscii: string;
  hintAnsi: string;

  // Export format
  exportKey: string;
  exportRar: string;
  exportKeyDesc: string;
  exportRarDesc: string;

  // Buttons
  btnGenerate: string;
  btnGenerating: string;
  btnDownloadKey: string;
  btnDownloadRar: string;
  btnCopy: string;
  btnCopied: string;

  // Result
  resultTitle: string;

  // Errors
  errEmpty: string;
  errTooLong: string;

  // Footer
  footerText: string;

  // Theme
  themeLight: string;
  themeDark: string;

  // Language
  labelLanguage: string;
}

// ============================================================
// TRANSLATIONS
// ============================================================

const en: Translation = {
  langName: "English",
  langFlag: "EN",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Runs entirely in your browser — no server, no data collection.",
  labelUsername: "Username",
  labelLicense: "License Name",
  labelEncoding: "Encoding",
  labelExportFormat: "Export Format",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Adds \"utf8:\" prefix for non-ASCII characters",
  hintAscii: "Only 7-bit ASCII characters allowed",
  hintAnsi: "Windows-1252 codepage for Western European characters",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Drag and drop to import",
  exportRarDesc: "Double-click to run automatic import",
  btnGenerate: "Generate Key",
  btnGenerating: "Generating…",
  btnDownloadKey: "Download rarreg.key",
  btnDownloadRar: "Download rarkey.rar",
  btnCopy: "Copy to Clipboard",
  btnCopied: "Copied!",
  resultTitle: "Registration Data",
  errEmpty: "Username and License Name must not be empty.",
  errTooLong: "Username and License Name must not exceed 200 characters.",
  footerText: "All computation runs client-side in your browser.",
  themeLight: "Light",
  themeDark: "Dark",
  labelLanguage: "Language",
};

const vi: Translation = {
  langName: "Tiếng Việt",
  langFlag: "VN",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Chạy hoàn toàn trên trình duyệt — không máy chủ, không thu thập dữ liệu.",
  labelUsername: "Tên người dùng",
  labelLicense: "Tên giấy phép",
  labelEncoding: "Mã hóa ký tự",
  labelExportFormat: "Định dạng xuất",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Thêm tiền tố \"utf8:\" cho ký tự không phải ASCII",
  hintAscii: "Chỉ cho phép ký tự ASCII 7-bit",
  hintAnsi: "Bảng mã Windows-1252 cho ký tự Tây Âu",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Kéo thả để nhập",
  exportRarDesc: "Nhấp đúp để tự động nhập",
  btnGenerate: "Tạo Key",
  btnGenerating: "Đang tạo…",
  btnDownloadKey: "Tải rarreg.key",
  btnDownloadRar: "Tải rarkey.rar",
  btnCopy: "Sao chép",
  btnCopied: "Đã sao chép!",
  resultTitle: "Dữ Liệu Đăng Ký",
  errEmpty: "Tên người dùng và Tên giấy phép không được để trống.",
  errTooLong: "Tên người dùng và Tên giấy phép không được quá 200 ký tự.",
  footerText: "Mọi tính toán chạy trên trình duyệt của bạn.",
  themeLight: "Sáng",
  themeDark: "Tối",
  labelLanguage: "Ngôn ngữ",
};

const id: Translation = {
  langName: "Bahasa Indonesia",
  langFlag: "ID",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Berjalan sepenuhnya di browser Anda — tanpa server, tanpa pengumpulan data.",
  labelUsername: "Nama Pengguna",
  labelLicense: "Nama Lisensi",
  labelEncoding: "Encoding",
  labelExportFormat: "Format Ekspor",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Menambahkan prefiks \"utf8:\" untuk karakter non-ASCII",
  hintAscii: "Hanya karakter ASCII 7-bit yang diizinkan",
  hintAnsi: "Codepage Windows-1252 untuk karakter Eropa Barat",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Seret dan lepas untuk mengimpor",
  exportRarDesc: "Klik dua kali untuk impor otomatis",
  btnGenerate: "Buat Key",
  btnGenerating: "Membuat…",
  btnDownloadKey: "Unduh rarreg.key",
  btnDownloadRar: "Unduh rarkey.rar",
  btnCopy: "Salin ke Clipboard",
  btnCopied: "Tersalin!",
  resultTitle: "Data Registrasi",
  errEmpty: "Nama Pengguna dan Nama Lisensi tidak boleh kosong.",
  errTooLong: "Nama Pengguna dan Nama Lisensi tidak boleh lebih dari 200 karakter.",
  footerText: "Semua komputasi berjalan di sisi klien di browser Anda.",
  themeLight: "Terang",
  themeDark: "Gelap",
  labelLanguage: "Bahasa",
};

const zh: Translation = {
  langName: "中文",
  langFlag: "CN",
  appTitle: "WinRAR 注册机",
  appBadge: "网页版",
  appSubtitle: "完全在浏览器中运行——无需服务器，不收集数据。",
  labelUsername: "用户名",
  labelLicense: "许可证名称",
  labelEncoding: "编码",
  labelExportFormat: "导出格式",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "为非 ASCII 字符添加 \"utf8:\" 前缀",
  hintAscii: "仅允许 7 位 ASCII 字符",
  hintAnsi: "Windows-1252 代码页（西欧字符）",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "拖放导入",
  exportRarDesc: "双击自动导入",
  btnGenerate: "生成密钥",
  btnGenerating: "生成中…",
  btnDownloadKey: "下载 rarreg.key",
  btnDownloadRar: "下载 rarkey.rar",
  btnCopy: "复制到剪贴板",
  btnCopied: "已复制！",
  resultTitle: "注册数据",
  errEmpty: "用户名和许可证名称不能为空。",
  errTooLong: "用户名和许可证名称不得超过 200 个字符。",
  footerText: "所有计算均在浏览器中运行。",
  themeLight: "浅色",
  themeDark: "深色",
  labelLanguage: "语言",
};

const ko: Translation = {
  langName: "한국어",
  langFlag: "KR",
  appTitle: "WinRAR Keygen",
  appBadge: "웹",
  appSubtitle: "브라우저에서 완전히 실행됩니다 — 서버 없음, 데이터 수집 없음.",
  labelUsername: "사용자 이름",
  labelLicense: "라이선스 이름",
  labelEncoding: "인코딩",
  labelExportFormat: "내보내기 형식",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "비ASCII 문자에 \"utf8:\" 접두사 추가",
  hintAscii: "7비트 ASCII 문자만 허용",
  hintAnsi: "Windows-1252 코드페이지 (서유럽 문자)",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "드래그 앤 드롭으로 가져오기",
  exportRarDesc: "더블 클릭으로 자동 가져오기",
  btnGenerate: "키 생성",
  btnGenerating: "생성 중…",
  btnDownloadKey: "rarreg.key 다운로드",
  btnDownloadRar: "rarkey.rar 다운로드",
  btnCopy: "클립보드에 복사",
  btnCopied: "복사됨!",
  resultTitle: "등록 데이터",
  errEmpty: "사용자 이름과 라이선스 이름은 비워둘 수 없습니다.",
  errTooLong: "사용자 이름과 라이선스 이름은 200자를 초과할 수 없습니다.",
  footerText: "모든 연산은 브라우저에서 실행됩니다.",
  themeLight: "밝은",
  themeDark: "어두운",
  labelLanguage: "언어",
};

const ja: Translation = {
  langName: "日本語",
  langFlag: "JP",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "ブラウザ上で完全に動作します — サーバー不要、データ収集なし。",
  labelUsername: "ユーザー名",
  labelLicense: "ライセンス名",
  labelEncoding: "エンコーディング",
  labelExportFormat: "エクスポート形式",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "非ASCII文字に \"utf8:\" プレフィックスを追加",
  hintAscii: "7ビットASCII文字のみ許可",
  hintAnsi: "Windows-1252 コードページ（西欧文字）",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "ドラッグ＆ドロップでインポート",
  exportRarDesc: "ダブルクリックで自動インポート",
  btnGenerate: "キー生成",
  btnGenerating: "生成中…",
  btnDownloadKey: "rarreg.key をダウンロード",
  btnDownloadRar: "rarkey.rar をダウンロード",
  btnCopy: "クリップボードにコピー",
  btnCopied: "コピー済み！",
  resultTitle: "登録データ",
  errEmpty: "ユーザー名とライセンス名は空にできません。",
  errTooLong: "ユーザー名とライセンス名は200文字以内にしてください。",
  footerText: "すべての計算はブラウザ上で実行されます。",
  themeLight: "ライト",
  themeDark: "ダーク",
  labelLanguage: "言語",
};

const fr: Translation = {
  langName: "Français",
  langFlag: "FR",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Fonctionne entièrement dans votre navigateur — pas de serveur, pas de collecte de données.",
  labelUsername: "Nom d'utilisateur",
  labelLicense: "Nom de licence",
  labelEncoding: "Encodage",
  labelExportFormat: "Format d'exportation",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Ajoute le préfixe \"utf8:\" pour les caractères non-ASCII",
  hintAscii: "Seuls les caractères ASCII 7 bits sont autorisés",
  hintAnsi: "Page de codes Windows-1252 pour les caractères d'Europe occidentale",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Glisser-déposer pour importer",
  exportRarDesc: "Double-cliquer pour importation automatique",
  btnGenerate: "Générer la clé",
  btnGenerating: "Génération…",
  btnDownloadKey: "Télécharger rarreg.key",
  btnDownloadRar: "Télécharger rarkey.rar",
  btnCopy: "Copier dans le presse-papiers",
  btnCopied: "Copié !",
  resultTitle: "Données d'enregistrement",
  errEmpty: "Le nom d'utilisateur et le nom de licence ne doivent pas être vides.",
  errTooLong: "Le nom d'utilisateur et le nom de licence ne doivent pas dépasser 200 caractères.",
  footerText: "Tous les calculs s'exécutent côté client dans votre navigateur.",
  themeLight: "Clair",
  themeDark: "Sombre",
  labelLanguage: "Langue",
};

const de: Translation = {
  langName: "Deutsch",
  langFlag: "DE",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Läuft vollständig in Ihrem Browser — kein Server, keine Datenerfassung.",
  labelUsername: "Benutzername",
  labelLicense: "Lizenzname",
  labelEncoding: "Kodierung",
  labelExportFormat: "Exportformat",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Fügt das Präfix \"utf8:\" für Nicht-ASCII-Zeichen hinzu",
  hintAscii: "Nur 7-Bit-ASCII-Zeichen erlaubt",
  hintAnsi: "Windows-1252-Codepage für westeuropäische Zeichen",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Drag & Drop zum Importieren",
  exportRarDesc: "Doppelklick für automatischen Import",
  btnGenerate: "Schlüssel generieren",
  btnGenerating: "Wird generiert…",
  btnDownloadKey: "rarreg.key herunterladen",
  btnDownloadRar: "rarkey.rar herunterladen",
  btnCopy: "In die Zwischenablage kopieren",
  btnCopied: "Kopiert!",
  resultTitle: "Registrierungsdaten",
  errEmpty: "Benutzername und Lizenzname dürfen nicht leer sein.",
  errTooLong: "Benutzername und Lizenzname dürfen 200 Zeichen nicht überschreiten.",
  footerText: "Alle Berechnungen werden clientseitig in Ihrem Browser ausgeführt.",
  themeLight: "Hell",
  themeDark: "Dunkel",
  labelLanguage: "Sprache",
};

const es: Translation = {
  langName: "Español",
  langFlag: "ES",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Se ejecuta completamente en tu navegador — sin servidor, sin recopilación de datos.",
  labelUsername: "Nombre de usuario",
  labelLicense: "Nombre de licencia",
  labelEncoding: "Codificación",
  labelExportFormat: "Formato de exportación",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Agrega el prefijo \"utf8:\" para caracteres no ASCII",
  hintAscii: "Solo se permiten caracteres ASCII de 7 bits",
  hintAnsi: "Página de códigos Windows-1252 para caracteres de Europa occidental",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Arrastrar y soltar para importar",
  exportRarDesc: "Doble clic para importación automática",
  btnGenerate: "Generar clave",
  btnGenerating: "Generando…",
  btnDownloadKey: "Descargar rarreg.key",
  btnDownloadRar: "Descargar rarkey.rar",
  btnCopy: "Copiar al portapapeles",
  btnCopied: "¡Copiado!",
  resultTitle: "Datos de registro",
  errEmpty: "El nombre de usuario y el nombre de licencia no deben estar vacíos.",
  errTooLong: "El nombre de usuario y el nombre de licencia no deben exceder los 200 caracteres.",
  footerText: "Todos los cálculos se ejecutan del lado del cliente en tu navegador.",
  themeLight: "Claro",
  themeDark: "Oscuro",
  labelLanguage: "Idioma",
};

const th: Translation = {
  langName: "ภาษาไทย",
  langFlag: "TH",
  appTitle: "WinRAR Keygen",
  appBadge: "เว็บ",
  appSubtitle: "ทำงานทั้งหมดในเบราว์เซอร์ของคุณ — ไม่มีเซิร์ฟเวอร์ ไม่เก็บข้อมูล",
  labelUsername: "ชื่อผู้ใช้",
  labelLicense: "ชื่อใบอนุญาต",
  labelEncoding: "การเข้ารหัส",
  labelExportFormat: "รูปแบบส่งออก",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "เพิ่มคำนำหน้า \"utf8:\" สำหรับอักขระที่ไม่ใช่ ASCII",
  hintAscii: "อนุญาตเฉพาะอักขระ ASCII 7 บิต",
  hintAnsi: "โค้ดเพจ Windows-1252 สำหรับอักขระยุโรปตะวันตก",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "ลากและวางเพื่อนำเข้า",
  exportRarDesc: "ดับเบิลคลิกเพื่อนำเข้าอัตโนมัติ",
  btnGenerate: "สร้างคีย์",
  btnGenerating: "กำลังสร้าง…",
  btnDownloadKey: "ดาวน์โหลด rarreg.key",
  btnDownloadRar: "ดาวน์โหลด rarkey.rar",
  btnCopy: "คัดลอกไปยังคลิปบอร์ด",
  btnCopied: "คัดลอกแล้ว!",
  resultTitle: "ข้อมูลการลงทะเบียน",
  errEmpty: "ชื่อผู้ใช้และชื่อใบอนุญาตต้องไม่เว้นว่าง",
  errTooLong: "ชื่อผู้ใช้และชื่อใบอนุญาตต้องไม่เกิน 200 ตัวอักษร",
  footerText: "การคำนวณทั้งหมดทำงานในเบราว์เซอร์ของคุณ",
  themeLight: "สว่าง",
  themeDark: "มืด",
  labelLanguage: "ภาษา",
};

const ms: Translation = {
  langName: "Bahasa Melayu",
  langFlag: "MY",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Berjalan sepenuhnya dalam pelayar anda — tiada pelayan, tiada pengumpulan data.",
  labelUsername: "Nama Pengguna",
  labelLicense: "Nama Lesen",
  labelEncoding: "Pengekodan",
  labelExportFormat: "Format Eksport",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Menambah awalan \"utf8:\" untuk aksara bukan ASCII",
  hintAscii: "Hanya aksara ASCII 7-bit dibenarkan",
  hintAnsi: "Halaman kod Windows-1252 untuk aksara Eropah Barat",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Seret dan lepas untuk mengimport",
  exportRarDesc: "Klik dua kali untuk import automatik",
  btnGenerate: "Jana Kunci",
  btnGenerating: "Menjana…",
  btnDownloadKey: "Muat turun rarreg.key",
  btnDownloadRar: "Muat turun rarkey.rar",
  btnCopy: "Salin ke Papan Keratan",
  btnCopied: "Disalin!",
  resultTitle: "Data Pendaftaran",
  errEmpty: "Nama Pengguna dan Nama Lesen tidak boleh kosong.",
  errTooLong: "Nama Pengguna dan Nama Lesen tidak boleh melebihi 200 aksara.",
  footerText: "Semua pengiraan dijalankan di pelayar anda.",
  themeLight: "Cerah",
  themeDark: "Gelap",
  labelLanguage: "Bahasa",
};

const ru: Translation = {
  langName: "Русский",
  langFlag: "RU",
  appTitle: "WinRAR Keygen",
  appBadge: "Веб",
  appSubtitle: "Работает полностью в вашем браузере — без сервера, без сбора данных.",
  labelUsername: "Имя пользователя",
  labelLicense: "Название лицензии",
  labelEncoding: "Кодировка",
  labelExportFormat: "Формат экспорта",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Добавляет префикс \"utf8:\" для символов не-ASCII",
  hintAscii: "Разрешены только 7-битные символы ASCII",
  hintAnsi: "Кодовая страница Windows-1252 для западноевропейских символов",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Перетащите для импорта",
  exportRarDesc: "Дважды щёлкните для автоматического импорта",
  btnGenerate: "Сгенерировать ключ",
  btnGenerating: "Генерация…",
  btnDownloadKey: "Скачать rarreg.key",
  btnDownloadRar: "Скачать rarkey.rar",
  btnCopy: "Копировать в буфер обмена",
  btnCopied: "Скопировано!",
  resultTitle: "Регистрационные данные",
  errEmpty: "Имя пользователя и название лицензии не должны быть пустыми.",
  errTooLong: "Имя пользователя и название лицензии не должны превышать 200 символов.",
  footerText: "Все вычисления выполняются на стороне клиента в вашем браузере.",
  themeLight: "Светлая",
  themeDark: "Тёмная",
  labelLanguage: "Язык",
};

const fil: Translation = {
  langName: "Filipino",
  langFlag: "PH",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Tumatakbo nang buo sa iyong browser — walang server, walang pangongolekta ng data.",
  labelUsername: "Pangalan ng User",
  labelLicense: "Pangalan ng Lisensya",
  labelEncoding: "Encoding",
  labelExportFormat: "Format ng Export",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Nagdadagdag ng \"utf8:\" prefix para sa mga non-ASCII na karakter",
  hintAscii: "Mga 7-bit ASCII na karakter lamang ang pinapayagan",
  hintAnsi: "Windows-1252 codepage para sa mga Western European na karakter",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "I-drag at i-drop para ma-import",
  exportRarDesc: "I-double click para sa awtomatikong pag-import",
  btnGenerate: "Gumawa ng Key",
  btnGenerating: "Ginagawa…",
  btnDownloadKey: "I-download rarreg.key",
  btnDownloadRar: "I-download rarkey.rar",
  btnCopy: "Kopyahin sa Clipboard",
  btnCopied: "Nakopya na!",
  resultTitle: "Data ng Rehistrasyon",
  errEmpty: "Hindi dapat blangko ang Pangalan ng User at Pangalan ng Lisensya.",
  errTooLong: "Hindi dapat lumampas sa 200 karakter ang Pangalan ng User at Pangalan ng Lisensya.",
  footerText: "Lahat ng computation ay tumatakbo sa iyong browser.",
  themeLight: "Maliwanag",
  themeDark: "Madilim",
  labelLanguage: "Wika",
};

const pt: Translation = {
  langName: "Português",
  langFlag: "BR",
  appTitle: "WinRAR Keygen",
  appBadge: "Web",
  appSubtitle: "Funciona inteiramente no seu navegador — sem servidor, sem coleta de dados.",
  labelUsername: "Nome de Usuário",
  labelLicense: "Nome da Licença",
  labelEncoding: "Codificação",
  labelExportFormat: "Formato de Exportação",
  encodingUtf8: "UTF-8",
  encodingAscii: "ASCII",
  encodingAnsi: "ANSI",
  hintUtf8: "Adiciona o prefixo \"utf8:\" para caracteres não-ASCII",
  hintAscii: "Apenas caracteres ASCII de 7 bits são permitidos",
  hintAnsi: "Página de código Windows-1252 para caracteres da Europa Ocidental",
  exportKey: "rarreg.key",
  exportRar: "rarkey.rar",
  exportKeyDesc: "Arrastar e soltar para importar",
  exportRarDesc: "Clique duplo para importação automática",
  btnGenerate: "Gerar Chave",
  btnGenerating: "Gerando…",
  btnDownloadKey: "Baixar rarreg.key",
  btnDownloadRar: "Baixar rarkey.rar",
  btnCopy: "Copiar para a Área de Transferência",
  btnCopied: "Copiado!",
  resultTitle: "Dados de Registro",
  errEmpty: "Nome de Usuário e Nome da Licença não podem estar vazios.",
  errTooLong: "Nome de Usuário e Nome da Licença não podem exceder 200 caracteres.",
  footerText: "Todos os cálculos são executados no lado do cliente no seu navegador.",
  themeLight: "Claro",
  themeDark: "Escuro",
  labelLanguage: "Idioma",
};

// ============================================================
// REGISTRY & CONTEXT
// ============================================================

export const translations: Record<LangCode, Translation> = {
  en, vi, id, zh, ko, ja, fr, de, es, th, ms, ru, fil, pt,
};

export const LANGUAGES: { code: LangCode; name: string; flag: string }[] = [
  { code: "en",  name: "English",          flag: "us" },
  { code: "vi",  name: "Tiếng Việt",       flag: "vn" },
  { code: "id",  name: "Bahasa Indonesia",  flag: "id" },
  { code: "zh",  name: "中文",              flag: "cn" },
  { code: "ko",  name: "한국어",            flag: "kr" },
  { code: "ja",  name: "日本語",            flag: "jp" },
  { code: "fr",  name: "Français",          flag: "fr" },
  { code: "de",  name: "Deutsch",           flag: "de" },
  { code: "es",  name: "Español",           flag: "es" },
  { code: "th",  name: "ภาษาไทย",          flag: "th" },
  { code: "ms",  name: "Bahasa Melayu",     flag: "my" },
  { code: "ru",  name: "Русский",           flag: "ru" },
  { code: "fil", name: "Filipino",          flag: "ph" },
  { code: "pt",  name: "Português",         flag: "br" },
];

export interface I18nContextValue {
  lang: LangCode;
  t: Translation;
  setLang: (lang: LangCode) => void;
}

export const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  t: en,
  setLang: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}
