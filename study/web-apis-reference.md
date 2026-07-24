# Web API 레퍼런스 — 이 프로젝트에서 실제로 쓴 브라우저 API

← [인덱스로](./README.md) · 관련: [Day 4](./day-4-browser-web-apis.md)

각 API를 **이 저장소의 실제 파일·코드**로 정리했다. 개념은 MDN 링크로. 모든 API 호출은
**기능 탐지(feature detection) + 폴백** 패턴을 따른다는 점에 주목하라.

---

## localStorage — 영구 키-값 저장

**파일**: `src/lib/storage.ts`, `src/lib/notify.ts`, `src/components/InstallToast.tsx`

```ts
window.localStorage.setItem("astropet-save-v1", JSON.stringify(state));
const raw = window.localStorage.getItem("astropet-save-v1");
const data = raw ? (JSON.parse(raw) as GameState) : null;
```

- 문자열만 저장 → `JSON.stringify`/`parse`로 직렬화. 동기 API. 도메인당 ~5–10MB.
- 이 프로젝트: 게임 세이브(`astropet-save-v1`), 알림 on/off(`astropet-alarm-v1`), 설치 토스트
  스누즈, **언어 선택**(`astropet-locale`, i18n).
- 📖 [MDN: Window.localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)

---

## Notification API — 로컬 알림

**파일**: `src/lib/notify.ts`, `src/hooks/usePwa.ts`

```ts
if (Notification.permission === "granted") {
  const reg = await navigator.serviceWorker.getRegistration();
  reg ? reg.showNotification(title, { body, icon, tag })
      : new Notification(title, { body });
}
// 권한 요청 (usePwa)
const perm = await Notification.requestPermission();  // "granted" | "denied" | "default"
```

- 탭이 (백그라운드라도) 살아있을 때만 동작. 앱 완전 종료 시 푸시는 서버(Web Push) 필요.
- 재회 윈도우가 열리는 순간(탭 백그라운드 + 권한 + 토글 on) 알림.
- 📖 [MDN: Notifications API](https://developer.mozilla.org/ko/docs/Web/API/Notifications_API)

---

## Service Worker — 백그라운드 캐싱 프록시

**파일**: `public/sw.js`, `src/hooks/usePwa.ts`

```ts
// 등록 (프로덕션에서만)
navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`);
// 업데이트 적용
reg.waiting?.postMessage("SKIP_WAITING");
navigator.serviceWorker.addEventListener("controllerchange", () => location.reload());
```

- 라이프사이클: `install`(캐시 프리로드) → `activate`(옛 캐시 청소) → `fetch`(요청 가로채기).
- 캐시 전략: 네비게이션=network-first, 정적 자산=cache-first. 버전은 `?v=` 쿼리로.
- 📖 [MDN: Service Worker API](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API)

---

## beforeinstallprompt / appinstalled — PWA 설치

**파일**: `src/hooks/usePwa.ts`

```ts
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
// 사용자가 "설치" 누를 때
await deferred.prompt();
const { outcome } = await deferred.userChoice;  // "accepted" | "dismissed"
```

- Chrome/Edge/안드로이드만. iOS Safari는 이벤트 없음 → "공유 → 홈 화면에 추가" 안내로 폴백.
- 📖 [MDN: BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)

---

## matchMedia — 미디어/디스플레이 쿼리 감지

**파일**: `src/hooks/usePwa.ts`

```ts
const installed = window.matchMedia?.("(display-mode: standalone)").matches;
```

- 설치된 앱으로 실행 중인지 감지. (CSS 미디어 쿼리를 JS에서 평가.)
- 📖 [MDN: Window.matchMedia](https://developer.mozilla.org/ko/docs/Web/API/Window/matchMedia)

---

## Web Share API — OS 공유 시트

**파일**: `src/lib/share.ts`, `src/components/panels/SharePanel.tsx`

```ts
if (typeof navigator.share === "function") {
  const data = { text, url };
  if (files && navigator.canShare?.({ files })) data.files = files;  // 이미지 공유 지원 탐지
  await navigator.share(data);
}
```

- 네이티브 공유 시트를 띄운다. 파일(공유 카드 PNG) 공유는 `canShare({ files })`로 먼저 확인.
- 취소(AbortError)와 실패를 구분해 폴백(다운로드/복사) 결정.
- 📖 [MDN: Navigator.share](https://developer.mozilla.org/ko/docs/Web/API/Navigator/share)

---

## Clipboard API — 클립보드 복사

**파일**: `src/lib/share.ts`

```ts
try {
  await navigator.clipboard.writeText(url);        // 표준
} catch {
  const ta = document.createElement("textarea");   // 구형 폴백
  ta.value = url; document.body.appendChild(ta); ta.select();
  document.execCommand("copy"); ta.remove();
}
```

- 📖 [MDN: Clipboard.writeText](https://developer.mozilla.org/ko/docs/Web/API/Clipboard/writeText)

---

## Web Animations API (WAAPI) — 명령형 애니메이션

**파일**: `src/hooks/usePetReaction.ts`

```ts
const el = ref.current;
if (el && typeof el.animate === "function") {
  el.animate(
    [ { transform: "scale(1, 1)" }, { transform: "scale(1.14, 0.88)" },
      { transform: "scale(0.92, 1.1)" }, { transform: "scale(1, 1)" } ],
    { duration: 460, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" }
  );
}
```

- keyframes 배열 + 옵션으로 요소를 **1회성 애니메이션**. 리렌더/리마운트 없이 재생.
- CSS `@keyframes`(선언형)와 대비되는 **명령형** 방식 — "탭할 때마다 새로 재생"에 적합.
- 📖 [MDN: Element.animate](https://developer.mozilla.org/ko/docs/Web/API/Element/animate)

---

## Vibration API — 햅틱 진동

**파일**: `src/hooks/usePetReaction.ts`

```ts
if (typeof navigator.vibrate === "function") navigator.vibrate(12);  // 12ms
```

- 안드로이드 Chrome/Firefox 동작. iOS Safari 미지원(무해한 no-op) → 기능 탐지 필수.
- 📖 [MDN: Navigator.vibrate](https://developer.mozilla.org/ko/docs/Web/API/Navigator/vibrate)

---

## Intl — 로케일별 숫자·날짜 포맷 (i18n)

**파일**: `src/i18n/I18nProvider.tsx`

```ts
new Intl.NumberFormat(locale).format(1234567);        // ko: 1,234,567 / de: 1.234.567 / ar: ١٬٢٣٤٬٥٦٧
new Intl.DateTimeFormat(locale, { month, day, hour, minute }).format(date);
```

- **직접 포맷하지 마라.** 브라우저 내장 `Intl`이 로케일별 천 단위·소수점·숫자 문자·날짜를 처리.
- 📖 [MDN: Intl](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl)

---

## Canvas 2D — 명령형 픽셀 렌더

**파일**: `src/components/SpacewalkGame.tsx`, `src/lib/satellites.ts`, `src/lib/share.ts`

```ts
const ctx = canvas.getContext("2d");
const dpr = Math.min(2, window.devicePixelRatio || 1);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);              // 레티나 선명도
ctx.fillStyle = "#7de8c3";
ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
ctx.drawImage(sprite, x, y, w, h);                   // 스프라이트 블릿
const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));  // → PNG
```

- 게임 렌더(60fps)·위성 드로잉·공유 카드 생성. DOM에 없어 매우 빠름.
- 📖 [MDN: Canvas API](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API)

---

## requestAnimationFrame — 게임 루프

**파일**: `src/components/SpacewalkGame.tsx`

```ts
let raf;
function frame(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000);  // 델타타임(초)
  last = ts;
  // ...물리 갱신(× dt)·draw...
  raf = requestAnimationFrame(frame);
}
raf = requestAnimationFrame(frame);
// 클린업: cancelAnimationFrame(raf)
```

- 브라우저가 다음 그리기 직전 호출(~60Hz). 델타타임으로 프레임레이트 독립 물리.
- 📖 [MDN: requestAnimationFrame](https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame)

---

## Web Audio API — 코드로 소리 합성

**파일**: `src/components/SpacewalkGame.tsx`

```ts
const audio = new (window.AudioContext || window.webkitAudioContext)();
const osc = audio.createOscillator(); const gain = audio.createGain();
osc.frequency.exponentialRampToValueAtTime(freq, audio.currentTime + 0.1);
osc.connect(gain).connect(audio.destination); osc.start();
```

- 위성 근접 "웅" 저음을 오실레이터+게인+필터로 합성 (오디오 파일 없이).
- 📖 [MDN: Web Audio API](https://developer.mozilla.org/ko/docs/Web/API/Web_Audio_API)

---

## Pointer Events — 통합 포인터 입력

**파일**: `src/components/SpacewalkGame.tsx`(가상 조이스틱), `src/components/screens/OrbitScreen.tsx`·`RaisingScreen.tsx`(펫 탭)

```tsx
const onPetTap = (e: React.PointerEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  spawn(e.clientX - rect.left, e.clientY - rect.top);   // 요소 상대좌표
};
// 저수준(게임): element.addEventListener("pointerdown" / "pointermove" / "pointerup" / "pointercancel")
```

- 마우스·터치·펜을 하나의 이벤트로 통합. `getBoundingClientRect`로 상대좌표 계산.
- 📖 [MDN: Pointer events](https://developer.mozilla.org/ko/docs/Web/API/Pointer_events)

---

## createPortal — React 트리 밖 렌더

**파일**: `src/components/SpacewalkGame.tsx`

```tsx
import { createPortal } from "react-dom";
return createPortal(<div className="fixed inset-0 z-[60]">...</div>, document.body);
```

- 전체화면 게임 오버레이를 부모의 CSS 제약 밖(`document.body`)에 렌더.
- 📖 [MDN: createPortal](https://react.dev/reference/react-dom/createPortal)

---

## Blob / File / Object URL — 파일 다루기

**파일**: `src/lib/share.ts`

```ts
const file = new File([blob], "astropet.png", { type: "image/png" });
const url = URL.createObjectURL(file);
const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
setTimeout(() => URL.revokeObjectURL(url), 4000);   // 메모리 해제
```

- 공유 카드를 다운로드(파일 공유 미지원 시 폴백)로 저장.
- 📖 [MDN: URL.createObjectURL](https://developer.mozilla.org/ko/docs/Web/API/URL/createObjectURL_static)

---

## document / visibilityState — 탭 가시성

**파일**: `src/hooks/useGame.ts`, `src/lib/notify.ts`

```ts
document.addEventListener("visibilitychange", () => { /* 탭 복귀 시 재정산 */ });
if (document.visibilityState === "visible") return;   // 보고 있으면 알림 불필요
```

- 탭이 보이는지로 알림 억제·복귀 정산을 결정.
- 📖 [MDN: Page Visibility API](https://developer.mozilla.org/ko/docs/Web/API/Page_Visibility_API)

---

## 타이머 & 이벤트 — setInterval / setTimeout / addEventListener

**파일**: 전반 (`useGame.ts` 1초 틱, `Hearts.tsx` 하트 소멸, `usePwa.ts` 이벤트)

```ts
const id = setInterval(() => setNow(Date.now()), 1000);   // 정리: clearInterval(id)
const t  = setTimeout(() => setVisible(true), 2500);      // 정리: clearTimeout(t)
window.addEventListener("resize", onResize);              // 정리: removeEventListener
```

- **항상 클린업**(`useEffect` return)에서 해제 — 누수·중복 방지.
- 📖 [MDN: setInterval](https://developer.mozilla.org/ko/docs/Web/API/setInterval)

---

← [인덱스로](./README.md) · [Day 4: 브라우저 플랫폼](./day-4-browser-web-apis.md) · [용어집](./glossary.md)
