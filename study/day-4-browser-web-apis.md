# Day 4 — 브라우저 플랫폼 & Web APIs (DOM·Canvas·PWA)

← [Day 3](./day-3-nextjs-tailwind.md) · [인덱스](./README.md) · 다음 → [Day 5](./day-5-architecture-i18n-perf-capstone.md)

> **예상 소요**: 4시간 (개념 2.5h + 실습·연습 1.5h)
> **교보재 파일**: `src/components/SpacewalkGame.tsx`, `src/lib/satellites.ts`, `src/lib/debris.ts`,
> `src/components/PetSvg.tsx`, `src/components/OrbitView.tsx`, `src/lib/share.ts`, `src/lib/notify.ts`,
> `src/hooks/usePwa.ts`, `public/sw.js`
> 곁에: [Web API 레퍼런스](./web-apis-reference.md)

---

## 학습 목표

- 브라우저의 **DOM·이벤트 루프·Pointer 이벤트**를 이해한다
- **SVG(선언형)** 와 **Canvas 2D(명령형) + requestAnimationFrame 게임 루프**를 구분하고 각각을 읽는다
- **델타타임 물리**가 왜 프레임레이트 독립성을 주는지 안다
- 이 프로젝트가 쓰는 **Web API 군**(localStorage·Notification·Web Share·Clipboard·WAAPI·Vibration·Intl·Web Audio)을 실전 코드로 익힌다
- **PWA**(서비스워커·캐시 전략·설치/업데이트 라이프사이클)를 설명할 수 있다

---

## 1. 멘탈 모델 브릿지 — 브라우저는 하나의 거대한 런타임

Python 스크립트는 실행되고 끝난다. 브라우저 탭은 **죽지 않는 이벤트 루프**를 돌리며:

- **DOM**(문서 객체 모델) = 화면의 요소 트리 (당신의 UI 상태)
- **이벤트 루프** = 클릭·타이머·네트워크 응답·애니메이션 프레임을 순서대로 처리 (asyncio 상시판)
- **단일 메인 스레드** = UI 그리기 + JS 실행을 같은 스레드가 함 → 여기서 오래 걸리면 화면이 멈춤

> React(Day 2)는 이 DOM을 **대신 관리**해준다. 하지만 오늘은 그 아래 **원시 플랫폼**을 본다.
> `SpacewalkGame`은 성능을 위해 React를 우회하고 이 원시 API를 직접 쓴다.

### Pointer 이벤트 (터치 + 마우스 통합)

`SpacewalkGame.tsx`는 가상 조이스틱을 `pointerdown/move/up/cancel`로 구현한다. React 컴포넌트에선
`onPointerDown={...}`, `React.PointerEvent` 타입을 쓴다 (`RaisingScreen`·`OrbitScreen`의 펫 탭).

```tsx
const onPetTap = (e: React.PointerEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  if (api.doPet()) { spawn(e.clientX - rect.left, e.clientY - rect.top); react(); }
};
```

`getBoundingClientRect()`로 요소의 화면상 위치를 얻어, 클릭 좌표를 요소 내부 상대좌표로 바꾼다.

---

## 2. 두 가지 그래픽 패러다임: SVG vs Canvas

### 2.1 SVG — 선언형 벡터 (DOM의 일부)

SVG는 **XML 마크업으로 도형을 선언**한다. DOM에 들어가므로 CSS·이벤트가 붙고, React로 그리기 좋다.
`src/components/PetSvg.tsx`(젤리 펫), `OrbitView.tsx`(지구+궤도), `src/lib/debris.ts`(쓰레기 7종)가 SVG다.

```tsx
// OrbitView.tsx — 펫 위치를 삼각함수로 계산해 선언적으로 배치
<svg viewBox="0 0 360 240">
  <circle cx={CX} cy={CY} r={EARTH_R} fill="url(#earth-g)" />
  <g transform={`translate(${x} ${y})`}>
    <circle r={8} fill={c.base} stroke="#ffffff" />
  </g>
</svg>
```

- `viewBox` = 내부 좌표계 (화면 크기와 무관 → 벡터라 무한 확대해도 안 깨짐)
- `x = CX + ORBIT_R * Math.sin(phase*2π)` — phase(0~1)로 원 궤도 위치 계산
- `<defs>`의 `radialGradient`·`clipPath` = 재사용 정의. `fill="url(#earth-g)"`로 참조.
- **장점**: 선언형(React 친화), 확대 무손실, CSS 애니메이션 가능. **단점**: 요소 수천 개면 느림.

`src/lib/debris.ts`는 SVG 문자열을 `data:image/svg+xml,...`(data URL)로 인코딩해, `<img>`(도감)와
Canvas 스프라이트(게임) **양쪽에서 재사용**한다 — 영리한 자산 공유.

### 2.2 Canvas 2D — 명령형 픽셀 (성능)

Canvas는 **JS로 픽셀을 직접 그리는** 명령형 API다. 수백 개 엔티티를 60fps로 그려야 하는
`SpacewalkGame`이 이걸 쓴다. matplotlib으로 프레임마다 그림을 다시 그리는 것과 비슷하다.

```tsx
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#7de8c3";
ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();   // 원 그리기
ctx.drawImage(sprite, x, y, w, h);                                // 이미지 블릿
```

- **DOM에 없다** → 이벤트·CSS 없음, 대신 매우 빠름. "그린 뒤엔 잊는다"(retained가 아니라 immediate).
- **DevicePixelRatio 대응**: 레티나에서 선명하려면 `canvas` 픽셀을 `dpr`배 키우고 좌표를 스케일:
  ```ts
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ```

> **언제 무엇을?** 정적/소수 요소·확대·React 통합 → **SVG**. 수백 개·매프레임 갱신·게임 →
> **Canvas**. 이 프로젝트가 둘 다 쓰며 대조를 보여준다.

---

## 3. 게임 루프: requestAnimationFrame + 델타타임 물리

`SpacewalkGame.tsx`의 심장. 브라우저가 다음 화면을 그리기 직전에 콜백을 부르는
`requestAnimationFrame`(rAF)으로 **초당 ~60회** 루프를 돈다:

```ts
function frame(ts: number) {
  const dt = Math.min(0.05, (ts - last) / 1000);   // 지난 프레임과의 시간차(초), 상한 클램프
  last = ts;
  // 1) 물리 갱신 (dt 기반)
  pet.vx += nx * THRUST_ACCEL * mag * dt;           // 조이스틱 방향으로 가속
  pet.vx *= (1 - SPACE_DRAG * dt);                  // 관성 감쇠
  pet.x  += pet.vx * dt;                            // 위치 = 위치 + 속도*시간
  gas    -= GAS_BURN_PER_SEC * mag * dt;            // 분사 가스 소모
  // 2) 렌더 (Canvas)
  draw(ctx, W, H, { ... });
  // 3) DOM HUD를 명령형으로 직접 갱신 (리렌더 없이 60fps)
  gasFillRef.current.style.width = `${(gas / GAS_MAX) * 100}%`;
  raf = requestAnimationFrame(frame);               // 다음 프레임 예약
}
raf = requestAnimationFrame(frame);
// 클린업: cancelAnimationFrame(raf)
```

**왜 `dt`를 곱하나? (핵심 개념)** 60Hz 기기와 120Hz 기기는 프레임 수가 다르다. `pet.x += vx`처럼
프레임당 고정량을 더하면 **빠른 기기에서 물체가 2배 빨라진다**. `pet.x += vx * dt`로 **시간당**
움직이면 프레임레이트와 무관하게 같은 속도가 된다. (물리 시뮬레이션의 기본 — Δt 적분.)

- `Math.min(0.05, ...)` — 탭이 백그라운드로 갔다 오면 `dt`가 커져 물체가 벽을 뚫는(tunneling)
  걸 막으려 상한을 둔다.
- **왜 React state가 아니라 `ref`+DOM 직접 갱신?** 60fps로 `setState`하면 React가 못 따라온다.
  그래서 게임 HUD는 `ref.current.style`/`textContent`로 **명령형 갱신**하고, React state는
  거친 것(게임오버 여부)만 관리한다. **Day 2의 예외가 여기다.**

### 엔티티 관리 & 충돌

엔티티는 평범한 배열(`debris[]`, `sats[]`, `parts[]`)이고 `splice`로 제거한다. 충돌은 원-원 거리:

```ts
if (Math.hypot(pet.x - d.x, pet.y - d.y) < PET_RADIUS + d.r) { /* 수거! */ }
```

### 오프스크린 스프라이트

SVG 쓰레기를 매 프레임 파싱하면 느리므로, 한 번 `new Image()`로 로드해 **오프스크린 canvas에
래스터화**해두고 `drawImage`로 블릿한다 (`spritesRef`). 텍스처 캐싱.

### Web Audio — "웅" 사운드

위성이 근접하면 `AudioContext`로 저음을 합성한다 (오실레이터 + 게인 + 필터):

```ts
const audio = new (window.AudioContext || webkitAudioContext)();
const osc = audio.createOscillator(); const gain = audio.createGain();
osc.frequency.exponentialRampToValueAtTime(...); // 주파수 스윕
```

에셋 없이 코드로 소리를 만든다.

---

## 4. Canvas로 이미지 만들기 — 공유 카드

`src/lib/share.ts`의 `renderShareCard()`는 1080×1080 canvas에 펫+정화량을 그려 **PNG File**로
만든다. 데이터 파이프라인이 리포트 이미지를 렌더하는 것과 유사:

```ts
const canvas = document.createElement("canvas");
canvas.width = 1080; canvas.height = 1080;
const ctx = canvas.getContext("2d");
// 배경 그라디언트, 펫 SVG를 Image로 로드해 drawImage, 텍스트 fillText ...
const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
return new File([blob], "astropet.png", { type: "image/png" });
```

이 File을 **Web Share API**로 공유하거나, 미지원 시 `<a download>`로 저장한다.

---

## 5. Web API 투어 (이 프로젝트가 쓰는 것들)

각 API는 [Web API 레퍼런스](./web-apis-reference.md)에 파일 경로·스니펫이 정리돼 있다. 요약:

| API | 어디에 | 무엇 |
|---|---|---|
| **localStorage** | `lib/storage.ts`·`notify.ts` | 브라우저 영구 키-값 저장 (작은 KV 스토어). 세이브·설정 |
| **Notification** | `lib/notify.ts`·`usePwa.ts` | 재회 알림. 권한 요청 → `showNotification` |
| **Web Share** | `lib/share.ts` | OS 공유 시트 (`navigator.share`, 파일 공유는 `canShare`) |
| **Clipboard** | `lib/share.ts` | `navigator.clipboard.writeText` (+`execCommand` 폴백) |
| **Web Animations (WAAPI)** | `hooks/usePetReaction.ts` | `element.animate([...keyframes], opts)` — 쓰다듬기 스퀴시 |
| **Vibration** | `hooks/usePetReaction.ts` | `navigator.vibrate(12)` — 진동 (안드로이드; iOS 무해한 no-op) |
| **Intl** | `i18n/I18nProvider.tsx` | `Intl.NumberFormat`/`DateTimeFormat` — 로케일별 숫자·날짜 (Day 5) |
| **matchMedia** | `usePwa.ts` | `matchMedia("(display-mode: standalone)")` — 설치 여부 감지 |
| **createPortal** | `SpacewalkGame.tsx` | React 트리 밖(`document.body`)에 전체화면 게임 렌더 |

**패턴: 기능 탐지(feature detection) + 폴백.** 모든 API 호출 전에 존재를 확인한다 —
`navigator.vibrate?.(12)`, `if (typeof navigator.share === "function")`. 미지원 브라우저에서
**깨지지 않고 우아하게 축소(graceful degradation)** 하는 게 프로 습관이다. (백엔드에서 optional
의존성을 try/except로 감싸는 것과 같은 방어.)

### localStorage 심화 (`lib/storage.ts`)

```ts
const KEY = "astropet-save-v1";
export function loadGame(): GameState | null {
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  const data = JSON.parse(raw) as GameState;
  if (data?.version !== 1) return null;   // 스키마 버전 불일치 → 폐기
  return data;
}
```

- 문자열만 저장 가능 → `JSON.stringify`/`JSON.parse`로 직렬화 (동기 API, 5~10MB 제한)
- **버전 태그로 마이그레이션 방어** (Day 1의 `version: 1` 리터럴 타입이 여기서 값으로 검사됨)

---

## 6. PWA — 웹을 앱처럼

**PWA(Progressive Web App)** = 설치 가능하고 오프라인에서도 도는 웹앱. 3요소: 매니페스트(Day 3)
+ 서비스워커 + HTTPS.

### 6.1 서비스워커 (`public/sw.js`) — 브라우저 속 프록시

서비스워커는 **페이지와 별개로 도는 백그라운드 스크립트**로, 네트워크 요청을 가로채 캐시한다.
(리버스 프록시/캐싱 레이어를 브라우저 안에 두는 셈.)

**라이프사이클**:

```
register → install(캐시 프리로드) → activate(옛 캐시 청소) → fetch(요청 가로채기)
```

```js
// install: 앱 셸을 미리 캐시
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/manifest.webmanifest", ...])))
);
// activate: 옛 버전 캐시 삭제
self.addEventListener("activate", (e) => { /* astropet-* 중 현재 버전 아닌 것 삭제 */ });
// fetch: 전략적으로 응답
self.addEventListener("fetch", (e) => { /* 아래 */ });
```

**캐시 전략** (요청 종류별로 다르게 — 중요):

| 요청 | 전략 | 이유 |
|---|---|---|
| 네비게이션(HTML) | **network-first** → 실패 시 캐시된 셸 | 최신 우선, 오프라인 대비 |
| `/_next/static/`·아이콘 | **cache-first** | 내용 해시 파일명이라 안 변함 → 캐시 안전 |
| 기타 GET | pass-through | |

**버전링 트릭**: SW를 `/sw.js?v=0.8.0`로 등록하고, 쿼리의 `v`로 캐시 이름을 짓는다
(`astropet-0.8.0`). URL이 바뀌면 브라우저가 **새 SW로 인식** → 배포 시 `package.json` 버전만
올리면 캐시가 갱신된다 (Day 3의 버전 주입과 연결).

### 6.2 업데이트 & 설치 (`usePwa.ts`)

- **업데이트**: 새 SW가 `waiting` 상태가 되면 `updateReady=true` → `Game.tsx`가 "새 버전이
  준비됐어요" 배너 표시 → 클릭 시 `postMessage("SKIP_WAITING")` → `controllerchange` → 자동 새로고침.
- **설치**: `beforeinstallprompt` 이벤트를 캡처해뒀다가 사용자가 "설치" 누르면 `prompt()` 호출.
  iOS Safari는 이 이벤트가 없어 "공유 → 홈 화면에 추가" 안내문으로 대체 (기능 탐지·폴백).
- **개발 중엔 SW 미등록**: `usePwa`는 `NODE_ENV==="production"`에서만 등록 (HMR 충돌 방지).
  그래서 PWA는 `npm run build && npx next start`로만 확인된다.

---

## 7. 실습

### 실습 A — 게임 루프 추적 (40분)

1. `src/components/SpacewalkGame.tsx`에서 `frame` 함수를 찾아, `dt` 계산 → 물리 갱신 → `draw` →
   HUD 갱신 → `requestAnimationFrame(frame)` 재예약의 한 사이클을 따라가라.
2. `pet.x += pet.vx * dt`에서 `* dt`를 (머릿속으로) 지우면 왜 기기마다 속도가 달라지는지 설명하라.
3. `createPortal`이 게임을 어디에 렌더하는지, 왜 `document.body`인지 생각하라 (전체화면 오버레이).

### 실습 B — Web API 만지기 (40분)

> ⚠️ 확인 후 `git checkout .`.

1. 브라우저 콘솔(F12)에서 직접 실행해보라:
   ```js
   localStorage.getItem("astropet-save-v1")     // 세이브 JSON 확인
   navigator.vibrate?.(200)                       // (안드로이드) 진동
   new Intl.NumberFormat("ar-EG").format(1234567) // 아랍어 숫자
   new Intl.NumberFormat("de-DE").format(1234.5)  // 독일식(1.234,5)
   ```
2. `usePetReaction.ts`의 `animate` keyframes 수치를 과장(`scale(1.6)`)해보고 `npm run dev`에서
   펫을 탭해 반응이 커지는지 보라.
3. `sw.js`를 읽고, network-first와 cache-first가 각각 어느 요청에 적용되는지 표로 정리하라.

---

## 8. 연습문제

1. **(20분)** SVG와 Canvas의 차이를 표로 정리하고, 이 프로젝트가 각각을 어디서 왜 쓰는지 예를 들어라.
2. **(20분)** 델타타임(`dt`) 기반 물리가 프레임레이트 독립성을 주는 원리를, 60Hz vs 120Hz 예로 설명하라.
3. **(30분)** 서비스워커의 install→activate→fetch 라이프사이클과 이 프로젝트의 캐시 전략·버전링
   트릭을 그림/글로 설명하라. "왜 개발 모드에선 SW를 안 켜는가?"도 답하라.

---

## 9. 자가 체크리스트

- [ ] DOM·이벤트 루프·Pointer 이벤트를 이해한다
- [ ] SVG(선언형)와 Canvas(명령형)를 구분하고 각각의 적합처를 안다
- [ ] rAF 게임 루프와 델타타임 물리를 설명하고, 왜 게임 HUD를 ref로 직접 갱신하는지 안다
- [ ] 기능 탐지+폴백 패턴으로 Web API를 안전하게 쓴다
- [ ] 서비스워커 라이프사이클·캐시 전략·PWA 설치/업데이트를 설명한다

---

## 10. 더 읽기

- [MDN — Canvas API 튜토리얼](https://developer.mozilla.org/ko/docs/Web/API/Canvas_API/Tutorial)
- [MDN — requestAnimationFrame](https://developer.mozilla.org/ko/docs/Web/API/Window/requestAnimationFrame)
- [MDN — Service Worker API](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API)
- [web.dev — PWA 학습](https://web.dev/learn/pwa/)
- 곁에: [Web API 레퍼런스](./web-apis-reference.md)

다음 → [Day 5: 아키텍처·i18n·성능 + 캡스톤](./day-5-architecture-i18n-perf-capstone.md)
