// 소셜 공유 유틸 — 웹 표준(Web Share, Clipboard, OG/Twitter, 표준 share-intent) 우선.
// 클라이언트 전용(navigator/document 사용).

import type { PetColor, SuitColor } from "./types";

export interface ShareStats {
  name: string;
  color: PetColor;
  suit: SuitColor | null;
  debrisTotal: number;
  createdAt: number;
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

interface KakaoSdk {
  isInitialized(): boolean;
  init(key: string): void;
  Share: { sendDefault(o: unknown): void };
}
declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

/** 함께한 일수 (최소 1) */
export function daysTogether(s: ShareStats): number {
  return Math.max(1, Math.floor((Date.now() - s.createdAt) / 86_400_000));
}

/** 공유 URL — 항상 현재 실제 도메인(런타임 origin) */
export function getShareUrl(): string {
  if (typeof window === "undefined") return "https://jd-06.vercel.app";
  const u = new URL(window.location.origin);
  u.searchParams.set("ref", "share");
  return u.toString();
}

/** OG 이미지 절대 URL */
export function getOgImageUrl(): string {
  const origin = typeof window === "undefined" ? "https://jd-06.vercel.app" : window.location.origin;
  return `${origin}/og.png`;
}

/** Web Share API 지원 여부 (텍스트/URL 공유) */
export function canWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function openPopup(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=650");
}

/**
 * 네이티브 공유 시트. files가 주어졌는데 파일 공유가 불가하면 false(폴백 유도).
 * 사용자가 취소(AbortError)하면 true(추가 폴백 불필요).
 */
export async function shareNative(text: string, url: string, files?: File[]): Promise<boolean> {
  if (!canWebShare()) return false;
  const data: ShareData = { text, url };
  if (files && files.length) {
    if (typeof navigator.canShare === "function" && navigator.canShare({ files })) {
      data.files = files;
    } else {
      return false;
    }
  }
  try {
    await navigator.share(data);
    return true;
  } catch (e) {
    return e instanceof Error && e.name === "AbortError";
  }
}

/** 페이스북 공유(표준 sharer) */
export function shareFacebook(url: string) {
  openPopup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
}

/** X(트위터) 공유(표준 intent) */
export function shareX(text: string, url: string) {
  openPopup(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  );
}

/** 링크 복사 (Clipboard API + execCommand 폴백) */
export async function copyLink(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    /* 폴백으로 진행 */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

async function loadKakaoSdk(): Promise<KakaoSdk | null> {
  if (typeof window === "undefined" || !KAKAO_KEY) return null;
  if (!window.Kakao) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("kakao sdk load fail"));
      document.head.appendChild(s);
    });
  }
  const Kakao = window.Kakao;
  if (!Kakao) return null;
  try {
    if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY);
  } catch {
    return null;
  }
  return Kakao;
}

export interface KakaoShareText {
  title: string;
  description: string;
  buttonTitle: string;
}

/** 카카오톡 공유. 키가 없거나 실패하면 false(폴백 유도) */
export async function shareKakao(url: string, text: KakaoShareText): Promise<boolean> {
  try {
    const Kakao = await loadKakaoSdk();
    if (!Kakao) return false;
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: text.title,
        description: text.description,
        imageUrl: getOgImageUrl(),
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: text.buttonTitle, link: { mobileWebUrl: url, webUrl: url } }],
    });
    return true;
  } catch {
    return false;
  }
}

/** 카카오 SDK 사용 가능(키 존재) 여부 */
export function hasKakao(): boolean {
  return !!KAKAO_KEY;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export interface ShareCardText {
  /** 상단 펫 이름 */
  name: string;
  /** 정화량 (예: "1,234개" / "1,234 pieces" — 로케일별 완성 문구) */
  count: string;
  /** 부제 (예: "우주쓰레기 정화 완료") */
  caption: string;
  /** 브랜드 워드마크 (예: "🛰️ 아스트로펫") */
  brand: string;
}

/** 캔버스용 다국어 폰트 스택 (CJK·아랍 시스템 폰트 폴백 포함) */
const CARD_FONT =
  "'Apple SD Gothic Neo','Noto Sans KR','Noto Sans SC','Noto Sans JP'," +
  "'Noto Sans Arabic','Malgun Gothic','PingFang SC','Hiragino Sans',sans-serif";

/**
 * 공유용 자랑 카드(1080×1080 PNG)를 그린다. 펫은 렌더된 PetSvg의 마크업을 넘겨받아 재사용.
 * 문자는 캔버스 시스템 폰트(다국어 폴백)로 렌더된다. 실패 시 null.
 */
export async function renderShareCard(
  stats: ShareStats,
  petSvg: string,
  card: ShareCardText
): Promise<File | null> {
  try {
    const S = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 배경
    const g = ctx.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, "#0b1026");
    g.addColorStop(0.55, "#141239");
    g.addColorStop(1, "#241a4d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    // 별
    for (let i = 0; i < 90; i++) {
      const x = (i * 137.5) % S;
      const y = (i * 89.3 + 40) % S;
      ctx.globalAlpha = 0.12 + ((i * 7) % 9) / 12;
      ctx.fillStyle = i % 9 === 0 ? "#f9a8d4" : i % 5 === 0 ? "#7de8c3" : "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 1.4 + ((i * 3) % 5) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 펫
    let svg = petSvg;
    if (svg && !svg.includes("xmlns")) svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    const petImg = svg ? await loadImage(`data:image/svg+xml,${encodeURIComponent(svg)}`) : null;
    if (petImg) {
      const ps = 540;
      ctx.drawImage(petImg, (S - ps) / 2, 205, ps, ps);
    }

    // 텍스트 (다국어 폰트 폴백 · 중앙 정렬이라 RTL도 그대로 렌더)
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 62px ${CARD_FONT}`;
    ctx.fillText(card.name, S / 2, 160);
    ctx.font = `800 108px ${CARD_FONT}`;
    ctx.fillStyle = "#7de8c3";
    ctx.fillText(card.count, S / 2, 830);
    ctx.font = `500 42px ${CARD_FONT}`;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(card.caption, S / 2, 892);
    ctx.font = `600 36px ${CARD_FONT}`;
    ctx.fillStyle = "#ffe9a8";
    ctx.fillText(card.brand, S / 2, 1000);

    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
    if (!blob) return null;
    return new File([blob], "astropet.png", { type: "image/png" });
  } catch {
    return null;
  }
}

/** 파일 다운로드 (파일 공유 미지원 시 폴백) */
export function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
