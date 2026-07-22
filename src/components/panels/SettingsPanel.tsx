"use client";

import { useState } from "react";
import SharePanel from "@/components/panels/SharePanel";
import type { PwaApi } from "@/hooks/usePwa";
import type { ShareStats } from "@/lib/share";

export default function SettingsPanel({
  pwa,
  onReset,
  onPlayCollect,
  shareStats,
}: {
  pwa: PwaApi;
  onReset: () => void;
  /** 제공되면 "함께 수거하기" 연습 버튼 노출 (궤도 단계에서 언제나 실행) */
  onPlayCollect?: () => void;
  /** 제공되면 소셜 공유 섹션 노출 (궤도 단계에서 자랑) */
  shareStats?: ShareStats;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 친구에게 자랑하기 */}
      {shareStats && <SharePanel stats={shareStats} />}

      {/* 함께 수거하기 (언제나) */}
      {onPlayCollect && (
        <section className="rounded-2xl bg-white/5 p-4">
          <span className="text-sm font-semibold">함께 수거하기 🧑‍🚀</span>
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            재회 시간이 아니어도 언제든 펫과 우주유영을 하며 우주쓰레기를 수거할 수 있어요.
          </p>
          <button
            onClick={onPlayCollect}
            className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
          >
            지금 수거하러 가기
          </button>
        </section>
      )}

      {/* 재회 알림 */}
      <section className="rounded-2xl bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">재회 알림 🔔</span>
          {pwa.notifSupported ? (
            <button
              onClick={() => void pwa.toggleAlarm()}
              aria-label="재회 알림 켜기/끄기"
              className={`h-7 w-12 rounded-full p-0.5 transition ${
                pwa.alarmEnabled ? "bg-mint" : "bg-white/15"
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transition-transform ${
                  pwa.alarmEnabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          ) : (
            <span className="text-xs text-white/45">지원 안 됨</span>
          )}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/55">
          다른 탭을 보는 중에 재회 윈도우가 열리면 알려드려요. 앱을 완전히 닫았을
          때 오는 푸시 알림은 계정 기능과 함께 업데이트될 예정이에요.
        </p>
        {pwa.notifSupported && pwa.notifPermission === "denied" && (
          <p className="mt-2 text-xs text-[#ff8a80]">
            알림이 차단되어 있어요. 브라우저 설정에서 이 사이트의 알림을
            허용해주세요.
          </p>
        )}
      </section>

      {/* 앱 설치 */}
      <section className="rounded-2xl bg-white/5 p-4">
        <span className="text-sm font-semibold">홈 화면에 설치 📲</span>
        {pwa.installState === "installed" ? (
          <p className="mt-2 text-xs text-mint">
            ✔ 설치된 앱으로 실행 중이에요. 고마워요!
          </p>
        ) : pwa.installState === "installable" ? (
          <button
            onClick={() => void pwa.promptInstall()}
            className="mt-3 w-full rounded-xl bg-mint py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
          >
            지금 설치하기
          </button>
        ) : pwa.installState === "ios-guide" ? (
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            Safari 하단의 <b className="text-white/80">공유 버튼</b>을 누른 뒤{" "}
            <b className="text-white/80">&ldquo;홈 화면에 추가&rdquo;</b>를 선택하면
            앱처럼 쓸 수 있어요.
          </p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-white/55">
            브라우저 메뉴의 <b className="text-white/80">&ldquo;설치&rdquo;</b> 또는{" "}
            <b className="text-white/80">&ldquo;홈 화면에 추가&rdquo;</b>로 설치할 수
            있어요.
          </p>
        )}
      </section>

      {/* 초기화 */}
      {confirming ? (
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-semibold">정말 처음부터 시작할까요?</p>
          <p className="mt-1 text-xs text-white/55">
            펫과 쌓은 추억(편지, 도감)이 모두 사라져요.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm transition active:scale-95"
            >
              취소
            </button>
            <button
              onClick={onReset}
              className="flex-1 rounded-xl bg-[#ff8a80] py-2.5 text-sm font-bold text-space-900 transition active:scale-95"
            >
              초기화
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="rounded-2xl bg-white/5 py-3 text-sm text-white/70 transition active:scale-95"
        >
          처음부터 다시 시작하기
        </button>
      )}

      <p className="text-center text-xs text-white/35">
        아스트로펫 v{pwa.version} · 데이터는 이 브라우저에 저장돼요
      </p>
    </div>
  );
}
