// i18n 설정 — 지원 언어(네이티브 표기·방향), 자동 감지, 저장 키.

export const LOCALES = [
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "pt", name: "Português", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];
export type Dir = "ltr" | "rtl";

export const LOCALE_CODES = LOCALES.map((l) => l.code) as LocaleCode[];
export const DEFAULT_LOCALE: LocaleCode = "en";
export const STORAGE_KEY = "astropet-locale";

export function dirOf(code: LocaleCode): Dir {
  return (LOCALES.find((l) => l.code === code)?.dir ?? "ltr") as Dir;
}

/** 저장값 → navigator 언어 기본 서브태그 → 기본(en) 순으로 감지 */
export function detectLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LOCALE_CODES as string[]).includes(saved)) return saved as LocaleCode;
  } catch {
    /* localStorage 접근 불가 무시 */
  }
  const navs =
    (typeof navigator !== "undefined" && (navigator.languages || [navigator.language])) || [];
  for (const l of navs) {
    const base = String(l).toLowerCase().split("-")[0];
    if ((LOCALE_CODES as string[]).includes(base)) return base as LocaleCode;
  }
  return DEFAULT_LOCALE;
}
