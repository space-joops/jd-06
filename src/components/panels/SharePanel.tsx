"use client";

import { useEffect, useRef, useState } from "react";
import PetSvg from "@/components/PetSvg";
import {
  buildShareText,
  canWebShare,
  copyLink,
  downloadFile,
  getShareUrl,
  renderShareCard,
  shareFacebook,
  shareKakao,
  shareNative,
  shareX,
  type ShareStats,
} from "@/lib/share";

export default function SharePanel({ stats }: { stats: ShareStats }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [webShare, setWebShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const petHostRef = useRef<HTMLDivElement>(null);
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setWebShare(canWebShare()), []);
  useEffect(
    () => () => {
      if (msgTimer.current) clearTimeout(msgTimer.current);
    },
    []
  );

  const flash = (m: string) => {
    if (msgTimer.current) clearTimeout(msgTimer.current);
    setMsg(m);
    msgTimer.current = setTimeout(() => setMsg(null), 2800);
  };

  const text = () => buildShareText(stats);
  const url = () => getShareUrl();

  const onCard = async () => {
    if (busy) return;
    setBusy(true);
    flash("카드 만드는 중…");
    const svg = petHostRef.current?.querySelector("svg")?.outerHTML ?? "";
    const file = await renderShareCard(stats, svg);
    setBusy(false);
    if (!file) {
      flash("카드 생성에 실패했어요 😢");
      return;
    }
    const shared = await shareNative(text(), url(), [file]);
    if (shared) {
      setMsg(null);
      return;
    }
    downloadFile(file);
    flash("카드를 저장했어요! 인스타그램 등에 올려보세요 📸");
  };

  const onKakao = async () => {
    if (await shareKakao(stats, url())) return;
    if (await shareNative(text(), url())) return;
    if (await copyLink(url())) flash("링크를 복사했어요! 카카오톡에 붙여넣어 공유하세요");
    else flash("공유에 실패했어요");
  };

  const onCopy = async () => {
    if (await copyLink(url())) flash("링크를 복사했어요! 🔗");
    else flash("복사에 실패했어요");
  };

  const onMore = async () => {
    if (!(await shareNative(text(), url()))) flash("이 브라우저는 공유 시트를 지원하지 않아요");
  };

  return (
    <section className="rounded-2xl bg-white/5 p-4">
      <span className="text-sm font-semibold">친구에게 자랑하기 🎉</span>
      <p className="mt-1 text-xs leading-relaxed text-white/55">
        {stats.name || "별이"}가 정화한 우주쓰레기{" "}
        <b className="text-mint">{stats.debrisTotal.toLocaleString()}</b>개를 공유해요.
      </p>

      <button
        onClick={onCard}
        disabled={busy}
        className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-bold text-space-900 transition active:scale-95 disabled:opacity-50"
      >
        🖼️ 카드로 자랑하기
      </button>

      <div className="mt-3 grid grid-cols-5 gap-2">
        <IconButton label="카카오톡" onClick={onKakao} bg="#FEE500">
          <KakaoGlyph />
        </IconButton>
        <IconButton label="페이스북" onClick={() => shareFacebook(url())} bg="#1877F2">
          <FacebookGlyph />
        </IconButton>
        <IconButton label="X" onClick={() => shareX(text(), url())} bg="#000000" ring>
          <XGlyph />
        </IconButton>
        <IconButton label="인스타그램" onClick={onCard} instagram>
          <InstagramGlyph />
        </IconButton>
        <IconButton label="링크 복사" onClick={onCopy} bg="rgba(255,255,255,0.12)">
          <LinkGlyph />
        </IconButton>
      </div>

      {webShare && (
        <button
          onClick={onMore}
          className="mt-2 w-full rounded-xl bg-white/8 py-2 text-xs font-semibold text-white/75 transition active:scale-95"
        >
          다른 앱으로 공유하기 ↗
        </button>
      )}

      {msg && <p className="mt-2 text-center text-xs font-semibold text-mint">{msg}</p>}

      {/* 카드 렌더용 숨은 펫 */}
      <div ref={petHostRef} aria-hidden className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <PetSvg color={stats.color} suit={stats.suit} expression="happy" bob={false} />
      </div>
    </section>
  );
}

function IconButton({
  label,
  onClick,
  bg,
  ring,
  instagram,
  children,
}: {
  label: string;
  onClick: () => void;
  bg?: string;
  ring?: boolean;
  instagram?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 transition active:scale-90"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          ring ? "ring-1 ring-white/25" : ""
        }`}
        style={
          instagram
            ? {
                background:
                  "linear-gradient(45deg,#feda75,#fa7e1e 25%,#d62976 50%,#962fbf 75%,#4f5bd5)",
              }
            : { background: bg }
        }
      >
        {children}
      </span>
      <span className="text-[10px] text-white/60">{label}</span>
    </button>
  );
}

// ── 브랜드 글리프 (코드 SVG, 무에셋) ──────────────────────────────────
function KakaoGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        fill="#3C1E1E"
        d="M12 5c-4.4 0-8 2.7-8 6 0 2.1 1.5 4 3.7 5.1-.2.6-.7 2.4-.8 2.8 0 .2.1.3.3.2.3-.2 2.6-1.8 3.2-2.2.5.1 1 .1 1.6.1 4.4 0 8-2.7 8-6s-3.6-6-8-6z"
      />
    </svg>
  );
}
function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        fill="#ffffff"
        d="M13.5 21v-7h2.3l.4-2.9h-2.7V9.3c0-.8.3-1.4 1.5-1.4h1.3V5.3c-.6-.1-1.4-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.8v2.2H8v2.9h2.4V21h3.1z"
      />
    </svg>
  );
}
function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#ffffff"
        d="M18.9 1.6h3.5l-7.6 8.7 8.9 11.8h-7l-5.5-7.2-6.3 7.2H1.4l8.2-9.3L1 1.6h7.2l4.9 6.6 5.8-6.6Zm-1.2 18.2h1.9L7.4 3.6H5.3l12.4 16.2Z"
      />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#ffffff" strokeWidth={2} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="#ffffff" stroke="none" />
    </svg>
  );
}
function LinkGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" aria-hidden>
      <path d="M9 15l6-6" />
      <path d="M11 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M13 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" />
    </svg>
  );
}
