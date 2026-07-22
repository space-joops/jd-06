"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  detectLocale,
  dirOf,
  STORAGE_KEY,
  type Dir,
  type LocaleCode,
} from "./config";
import { MESSAGES } from "./messages";

type Params = Record<string, string | number>;

interface I18nCtx {
  locale: LocaleCode;
  dir: Dir;
  setLocale: (code: LocaleCode) => void;
  /** 점경로 키 → 현재 언어 문자열({var} 치환), 없으면 en·ko 폴백 */
  t: (key: string, params?: Params) => string;
  /** 배열 메시지(예: 이름 프리셋) 조회 */
  tlist: (key: string) => string[];
  formatNumber: (n: number) => string;
  formatDate: (ms: number) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

function resolve(obj: unknown, key: string): unknown {
  return key
    .split(".")
    .reduce<unknown>(
      (o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined),
      obj
    );
}

function interpolate(s: string, params?: Params): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k: string) => (k in params ? String(params[k]) : `{${k}}`));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  // 하이드레이션 후 자동 감지 (서버·클라 첫 렌더는 동일 = DEFAULT, 이후 감지값으로 전환)
  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  // 문서 lang/dir 반영 (아랍어 RTL)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* 무시 */
    }
    setLocaleState(code);
  }, []);

  const value = useMemo<I18nCtx>(() => {
    const cur = MESSAGES[locale] ?? MESSAGES.en;
    const t = (key: string, params?: Params): string => {
      const raw = resolve(cur, key) ?? resolve(MESSAGES.en, key) ?? resolve(MESSAGES.ko, key);
      if (typeof raw !== "string") return key;
      return interpolate(raw, params);
    };
    const tlist = (key: string): string[] => {
      const raw = resolve(cur, key) ?? resolve(MESSAGES.en, key);
      return Array.isArray(raw) ? (raw as string[]) : [];
    };
    const formatNumber = (n: number) => new Intl.NumberFormat(locale).format(n);
    const formatDate = (ms: number) =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(ms));
    return { locale, dir: dirOf(locale), setLocale, t, tlist, formatNumber, formatDate };
  }, [locale, setLocale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18nCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}
