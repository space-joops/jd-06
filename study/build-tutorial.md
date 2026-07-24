# 따라하기 실습 — 아스트로펫을 처음부터 직접 만들기 (TODO 빌드 가이드)

← [인덱스로](./README.md)

> **목표**: `create-next-app`으로 **빈 프로젝트를 만드는 순간부터 완성까지**, 우리 게임이 쓴
> **모든 웹기술**(Next.js·TS·React·Tailwind·HTML/CSS·SVG·Canvas·PWA·Web API·i18n·소셜공유)을
> 당신 손으로 다시 구현한다.
> **철학**: 복붙 금지. 각 TODO는 "무엇을 만들지 + 우리 어느 문서/파일을 **찾아볼지**"만 알려준다.
> 코드는 **읽고 이해한 뒤 네 손으로 재작성**하라. 그래야 근육이 생긴다.
> **예상 소요**: 3~5일 (5일 커리큘럼을 끝낸 뒤 캡스톤 프로젝트로 권장)

---

## 0. 게임의 규칙 (반드시 읽기)

1. **먼저 스스로 시도한다.** TODO의 "목표"만 보고 직접 짜본다.
2. **막히면 참고 파일을 연다.** "참고" 칸의 우리 문서·소스를 읽는다.
3. **복붙하지 않는다.** 우리 코드는 **정답지(answer key)** 다. 읽고 닫은 뒤, 기억으로 재작성하라.
   막히면 다시 열어도 되지만 **한 줄도 복사하지 말 것.** (이해 없이 붙인 코드는 실력이 안 된다.)
4. **각 마일스톤 끝에 커밋한다.** `git commit -m "M3: 화면·스테이지 머신"` 식으로. 진행이 기록된다.
5. **작게 만들어도 된다.** 우리 게임의 축소판이면 충분하다. 핵심은 **각 기술을 한 번씩 손으로 통과**하는 것.

### 준비물
- Node.js 20+, 코드 에디터(VS Code 권장), 이 저장소(참고용 정답지).
- 우리 학습 문서 전체([README](./README.md))를 미리 훑어두면 좋다.

### 당신이 만들 것 (완성 기준)
분양 → 부화 → 이름짓기 → 육성 → 발사 → 궤도(자동수거·재회·편지) 흐름을 도는, **설치 가능한
다국어 PWA 게임**. 우리 것과 똑같을 필요는 없고, **아래 12개 마일스톤의 기술을 모두 통과**하면 완주다.

---

## 🗺️ 마일스톤 지도

- [ ] **M0** 프로젝트 생성 & 툴체인 *(Next.js·TS·Tailwind·ESLint)*
- [ ] **M1** 도메인 타입 & 순수 로직 *(TypeScript·순수함수)*
- [ ] **M2** 상태 훅 & 저장 *(React Hooks·localStorage)*
- [ ] **M3** 화면 & 스테이지 머신 *(HTML/JSX·Tailwind·조건부 렌더)*
- [ ] **M4** SVG 캐릭터 & CSS 애니메이션 *(SVG·@keyframes)*
- [ ] **M5** 궤도 시각화 & 상호작용 *(SVG 좌표·Pointer·WAAPI·Vibration)*
- [ ] **M6** Canvas 미니게임 *(Canvas 2D·requestAnimationFrame·델타타임 물리)*
- [ ] **M7** PWA *(manifest·Service Worker·설치/업데이트)*
- [ ] **M8** 국제화 i18n *(Context·Intl·RTL·타입안전 카탈로그)*
- [ ] **M9** 소셜 공유 *(Web Share·Clipboard·Canvas 카드·OG 메타)*
- [ ] **M10** 알림 & 오프라인 정산 *(Notification·visibilitychange·시간 계산)*
- [ ] **M11** 마무리 *(빌드·린트·성능·접근성·배포)*

---

## M0 — 프로젝트 생성 & 툴체인

**목표**: 빈 Next.js 15 + TypeScript + Tailwind v4 프로젝트를 만들고 실행한다.
**쓰는 웹기술**: Next.js App Router, npm, TypeScript, Tailwind, ESLint
**참고**: [Day 3 §1~2](./day-3-nextjs-tailwind.md), [Day 1 §5(툴체인)](./day-1-javascript-typescript.md), 우리 `package.json`·`tsconfig.json`·`src/app/`

**TODO**
- [ ] `npx create-next-app@latest my-astropet` 실행 (TypeScript·Tailwind·App Router·`src/` 디렉터리 **예**, ESLint **예**).
- [ ] `npm run dev`로 기본 페이지가 뜨는지 확인. 포트·핫리로드 체감.
- [ ] `src/app/page.tsx`·`layout.tsx`·`globals.css`를 열어 우리 것과 구조를 비교하라.
- [ ] 우리 폴더 구조(`lib`/`hooks`/`components`/`i18n`)를 참고해 빈 폴더를 미리 만들어 둔다.
- [ ] `tsconfig.json`의 `paths`(`@/*`)가 있는지 확인 (없으면 추가).

**완료 기준**: `npm run dev`로 내 페이지가 뜨고, `npm run build`·`npm run lint`가 통과한다.
**막히면**: [Day 3](./day-3-nextjs-tailwind.md) 처음부터. 우리 `src/app/layout.tsx`로 `<html><body>` 골격을 확인.

---

## M1 — 도메인 타입 & 순수 로직

**목표**: 게임 상태(`GameState`)와 스테이지·기분·궤도 계산을 **React 없는 순수 함수**로 만든다.
**쓰는 웹기술**: TypeScript(union·interface·`Record`·리터럴 타입), 순수 함수, 불변 업데이트
**참고**: [Day 1 §4(타입)](./day-1-javascript-typescript.md), [JS 기초 §8(값/참조·불변성)](./foundations-js.md), 우리 `src/lib/types.ts`·`src/lib/game.ts`·`src/lib/constants.ts`

**TODO**
- [ ] `src/lib/types.ts`: `Stage`(union), `PetColor`, `GameState`(interface, `version: 1` 리터럴 태그) 정의.
      → 우리 `types.ts`의 **모양만** 참고하고 필드는 네가 정하라(작게 시작).
- [ ] `src/lib/constants.ts`: 튜닝 수치(궤도 주기, 기분 감쇠 시간 등)를 상수로. 도감 정의는 `Record<DebrisId, ...>`로.
- [ ] `src/lib/game.ts`: `clamp`, `currentMood(state, now)`(지연 계산), `orbitInfo(launchedAt, now)`,
      각 스테이지 액션(`chooseEgg`/`warmEgg`/`nameAndStart`/...) 을 **순수 함수**로.
      → **핵심 규약**: `now`를 인자로 받고, 조건 불충족 시 **원본을 그대로 반환**(불변). 우리 `game.ts` 패턴 응용.
- [ ] `settle(state, now)`: 경과 시간만큼 자동 수거·편지 적립을 계산해 새 상태 반환.

**완료 기준**: `game.ts`만 import해서 콘솔/작은 테스트로 `orbitInfo`·`settle`이 맞게 도는지 확인
(React 없이). 타입 에러 0.
**막히면**: [Day 1 §2.4 불변 업데이트](./day-1-javascript-typescript.md), 우리 `game.ts`의 `settle`/`orbitInfo` 주석.

> 💡 이 계층을 순수하게 유지하면 **테스트가 쉽다**([Day 5 §6](./day-5-architecture-i18n-perf-capstone.md)). 지금 습관 들여라.

---

## M2 — 상태 훅 & 저장 (localStorage)

**목표**: 순수 로직을 React와 잇는 `useGame` 훅을 만들고, 세이브를 localStorage에 저장·복원한다.
**쓰는 웹기술**: React Hooks(`useState`·`useEffect`·`useRef`), `setInterval` 틱, localStorage, JSON
**참고**: [Day 2 §3~4(Hooks·커스텀 훅)](./day-2-react.md), [Web API 레퍼런스(localStorage)](./web-apis-reference.md), 우리 `src/hooks/useGame.ts`·`src/lib/storage.ts`

**TODO**
- [ ] `src/lib/storage.ts`: `loadGame()`/`saveGame(state)`/`clearGame()`. `JSON.stringify/parse`,
      `version` 불일치 시 폐기. **try/catch로 방어**([JS 기초 §6](./foundations-js.md)).
- [ ] `src/hooks/useGame.ts`: `useState<GameState|null>`로 상태, 마운트 시 `loadGame()`+`settle()`.
- [ ] **1초 틱**: `useEffect`에서 `setInterval(() => setNow(Date.now()), 1000)` + 클린업으로 정리.
- [ ] **자동 저장**: `useEffect(() => { if (state) saveGame(state); }, [state])`.
- [ ] 액션을 감싸 UI에 성공여부를 돌려주는 `run(fn)` 헬퍼 — `next !== prev`(참조 비교)로 판정.
      → 우리 `useGame`의 `stateRef` + `run` 패턴을 이해하고 응용(stale closure 회피).

**완료 기준**: 새로고침해도 상태가 유지되고, 1초마다 시간이 흐른다(궤도 카운트다운이 준다).
**막히면**: [Day 2 §3.2~3.3(useEffect·useRef)](./day-2-react.md), 우리 `useGame.ts`.

---

## M3 — 화면 & 스테이지 머신

**목표**: 스테이지에 따라 다른 화면을 그리는 선언적 UI를 만든다 (분양~궤도).
**쓰는 웹기술**: JSX(HTML), Tailwind CSS, 조건부/스위치 렌더, props, controlled input
**참고**: [HTML 기초](./foundations-html.md), [CSS 기초](./foundations-css.md), [Day 2 §2·5](./day-2-react.md), [Day 3 §5(Tailwind)](./day-3-nextjs-tailwind.md), 우리 `src/components/Game.tsx`·`src/components/screens/*`

**TODO**
- [ ] `Game.tsx`(클라이언트 루트, `"use client"`): `useGame()` → `switch(stage)`로 화면 분기.
      로딩 중엔 스플래시. → 우리 `Game.tsx`의 `Screens` 스위치 응용.
- [ ] 최소 화면 3개부터: `AdoptScreen`(알 색 선택), `NameScreen`(이름 입력), `OrbitScreen`(궤도).
- [ ] **레이아웃**: `flex flex-col items-center`, `max-w-[430px]` 중앙 프레임을 Tailwind로.
      → [CSS 기초 §4(Flexbox)](./foundations-css.md) 응용.
- [ ] `NameScreen`에 **controlled input** 만들기: `value`+`onChange`+state.
      → [HTML 기초 §3.3](./foundations-html.md), 우리 `NameScreen.tsx`.
- [ ] `OrbitScreen`에 시맨틱 구조(`<header>`/`<section>`/`<nav>`) + 버튼들(간식·함께수거).

**완료 기준**: 알 선택 → 이름 입력 → 궤도 화면까지 **상태만 바꿔** 화면이 전환된다(명령형 DOM 조작 없이).
**막히면**: [Day 2 §1(선언형 사고)](./day-2-react.md), 우리 `screens/` 각 파일.

---

## M4 — SVG 캐릭터 & CSS 애니메이션

**목표**: 이미지 파일 없이 **코드로 그린 SVG 펫**과 둥실/깜빡임 CSS 애니메이션을 만든다.
**쓰는 웹기술**: SVG(선언형 벡터), `@keyframes`, CSS 변수/토큰, `transform`
**참고**: [Day 4 §2.1(SVG)](./day-4-browser-web-apis.md), [CSS 기초 §6~7](./foundations-css.md), 우리 `src/components/PetSvg.tsx`·`src/components/EggSvg.tsx`·`src/app/globals.css`

**TODO**
- [ ] `PetSvg.tsx`: `<svg viewBox>` 안에 `<circle>`/`<ellipse>`/`<path>`로 젤리 몸통·눈·안테나.
      색은 props(`color`)로. → 우리 `PetSvg`의 구조만 참고, 도형은 네 스타일로.
- [ ] `globals.css`에 `@theme` 색 토큰(`--color-mint` 등) 정의 → `bg-mint`/`fill` 등에 사용.
- [ ] `@keyframes bob`(둥실)·`blink`(눈 깜빡) 정의 + `.anim-bob` 등 유틸 클래스. 펫에 적용.
      → [CSS 기초 §6](./foundations-css.md), 우리 `globals.css`의 keyframes 목록 응용.
- [ ] (선택) `EggSvg`에서 탭할 때 `key`를 바꿔 흔들림 애니를 재시작하는 트릭([Day 2 §5](./day-2-react.md)).

**완료 기준**: 펫이 둥실거리고 눈을 깜빡인다. 색 토큰 하나를 바꾸면 전체 톤이 바뀐다.
**막히면**: 우리 `PetSvg.tsx`·`globals.css`, [Day 4 §2.1](./day-4-browser-web-apis.md).

---

## M5 — 궤도 시각화 & 상호작용

**목표**: 지구+궤도+펫 위치를 SVG로 그리고, 쓰다듬기 반응(스퀴시+진동)을 붙인다.
**쓰는 웹기술**: SVG 좌표(삼각함수), Pointer Events, Web Animations API, Vibration API
**참고**: [Day 4 §1·§5](./day-4-browser-web-apis.md), [JS 기초 §5(이벤트)](./foundations-js.md), [Web API 레퍼런스(WAAPI·Vibration·Pointer)](./web-apis-reference.md), 우리 `src/components/OrbitView.tsx`·`src/hooks/usePetReaction.ts`

**TODO**
- [ ] `OrbitView.tsx`: `x = CX + R*sin(phase*2π)`, `y = CY - R*cos(phase*2π)`로 펫 마커 배치.
      반대편(상공 아님)일 땐 지구 뒤로 숨기기(가시성 조건). → 우리 `OrbitView` 좌표 응용.
- [ ] 펫 탭 핸들러: `onPointerDown`에서 이벤트 객체로 좌표를 얻어 하트 파티클 스폰.
      → [JS 기초 §5](./foundations-js.md), 우리 `Hearts.tsx`의 `useHearts` 클로저 패턴.
- [ ] `usePetReaction` 훅: `ref.current.animate([...keyframes], {duration})`로 1회성 스퀴시 +
      `navigator.vibrate?.(12)`. **기능 탐지·폴백** 잊지 말 것. → 우리 `usePetReaction.ts` 응용.

**완료 기준**: 궤도 위상에 따라 펫이 상공에 나타났다 반대편에서 사라진다. 탭하면 눌리는 반응 + (안드로이드) 진동.
**막히면**: 우리 `OrbitView.tsx`·`usePetReaction.ts`, [Web API 레퍼런스](./web-apis-reference.md).

---

## M6 — Canvas 미니게임 (우주유영 수거)

**목표**: `requestAnimationFrame` 게임 루프 + 델타타임 물리로 도는 Canvas 아케이드 게임.
**쓰는 웹기술**: Canvas 2D, `requestAnimationFrame`, 델타타임 물리, Pointer 조이스틱, (선택) Web Audio, `createPortal`
**참고**: [Day 4 §2.2·§3](./day-4-browser-web-apis.md), 우리 `src/components/SpacewalkGame.tsx`·`src/lib/satellites.ts`

**TODO**
- [ ] 전체화면 오버레이를 `createPortal`로 `document.body`에 렌더.
- [ ] `<canvas>` + `getContext("2d")`. `devicePixelRatio`로 선명도 보정(`setTransform`).
- [ ] **게임 루프**: `frame(ts)`에서 `dt = min(0.05, (ts-last)/1000)` → 물리 갱신(`x += vx*dt`) →
      `draw()` → `requestAnimationFrame(frame)`. 클린업에서 `cancelAnimationFrame`.
      → **왜 `*dt`인지** 설명할 수 있어야 한다([Day 4 §3](./day-4-browser-web-apis.md)).
- [ ] 가상 조이스틱: 포인터 드래그로 추력 방향·세기. 관성 감쇠·벽 반사.
- [ ] 쓰레기 엔티티 배열 + 원-원 충돌(`Math.hypot < r1+r2`)로 수거. 종료 시 결과를 부모로 전달.
- [ ] (선택) 근접 사운드를 `AudioContext` 오실레이터로 합성.

**완료 기준**: 손가락으로 펫을 밀어 우주쓰레기를 수거하고, 60fps로 부드럽게 돈다. 기기가 달라도 속도가 같다.
**막히면**: 우리 `SpacewalkGame.tsx`의 `frame`·물리·스프라이트, [Day 4 §3](./day-4-browser-web-apis.md).

> ⚠️ 여기가 **유일하게 명령형(ref+DOM 직접 갱신)이 정당한** 곳이다. 왜인지 [Day 2 §3.3](./day-2-react.md)·[Day 4 §3](./day-4-browser-web-apis.md)로 되새겨라.

---

## M7 — PWA (설치 가능·오프라인)

**목표**: 매니페스트 + 서비스워커로 설치 가능하고 오프라인에서도 뜨는 앱으로 만든다.
**쓰는 웹기술**: Web App Manifest, Service Worker(캐시 전략·버전링), 설치/업데이트 라이프사이클, `matchMedia`
**참고**: [Day 4 §6](./day-4-browser-web-apis.md), [Day 3 §2.4(manifest)](./day-3-nextjs-tailwind.md), 우리 `src/app/manifest.ts`·`public/sw.js`·`src/hooks/usePwa.ts`

**TODO**
- [ ] `src/app/manifest.ts`: `MetadataRoute.Manifest` 반환(name·`display: standalone`·아이콘). 아이콘 몇 개 준비.
- [ ] `public/sw.js`: `install`(앱 셸 프리캐시)·`activate`(옛 캐시 삭제)·`fetch`(네비=network-first,
      정적=cache-first). 캐시 이름에 버전(`?v=`) 넣기. → 우리 `sw.js` 전략 표를 응용.
- [ ] `usePwa` 훅: **프로덕션에서만** SW 등록, `updateReady` 감지 → 업데이트 배너 → `SKIP_WAITING`·reload.
- [ ] `beforeinstallprompt` 캡처 → 설치 버튼. iOS는 안내문 폴백. `matchMedia("(display-mode: standalone)")`로 설치 감지.

**완료 기준**: `npm run build && npx next start` 후 브라우저에서 "설치" 가능, 오프라인에서도 앱 셸이 뜬다.
버전 올리면 업데이트 배너가 뜬다.
**막히면**: 우리 `sw.js`·`usePwa.ts`, [Day 4 §6](./day-4-browser-web-apis.md). *(개발 모드에선 SW 미등록 — 왜인지 설명해보라.)*

---

## M8 — 국제화 i18n (다국어 + RTL)

**목표**: 브라우저 언어 자동 감지 + 설정 전환, 최소 3개 언어(예: ko·en·ar) + 아랍어 RTL.
**쓰는 웹기술**: React Context, `Intl.NumberFormat/DateTimeFormat`, `document.dir`(RTL), 타입안전 카탈로그(`typeof`), Tailwind 논리 클래스
**참고**: [Day 5 §3(i18n)](./day-5-architecture-i18n-perf-capstone.md), [Day 1 §4.4(`typeof`)](./day-1-javascript-typescript.md), 우리 `src/i18n/*`·`src/components/panels/LanguagePanel.tsx`

**TODO**
- [ ] `i18n/config.ts`: 지원 언어(code·nativeName·dir), `DEFAULT_LOCALE`, `detectLocale()`
      (localStorage → `navigator.languages` → 폴백).
- [ ] `i18n/messages/ko.ts`를 원본으로 `export type Messages = typeof ko`. `en.ts`·`ar.ts`는 이 타입을 만족.
      → **키를 빠뜨리면 빌드가 실패**하는 걸 직접 겪어보라([Day 5 §3.2](./day-5-architecture-i18n-perf-capstone.md)).
- [ ] `I18nProvider`(Context): `t(key, params)`(점경로+폴백+`{var}` 치환), `formatNumber/Date`(`Intl`),
      `document.documentElement.lang/dir` 갱신. `useMemo`로 값 구성. 루트를 `<I18nProvider>`로 감싸기.
- [ ] `LanguagePanel`: 언어 목록을 각자 네이티브 표기로, `setLocale`로 전환(+localStorage 저장).
- [ ] 화면의 하드코딩 문자열을 `t("...")`로 교체. 아랍어에서 `dir="rtl"`이 켜지는지 확인.

**완료 기준**: 브라우저 언어에 따라 자동 선택되고, 설정에서 바꾸면 즉시 전환·새로고침 후 유지. 아랍어면 우→좌.
**막히면**: 우리 `src/i18n/`, [Day 5 §3](./day-5-architecture-i18n-perf-capstone.md).

---

## M9 — 소셜 공유

**목표**: 정화량 자랑 카드(Canvas PNG)를 만들고 Web Share/Clipboard로 공유, OG 링크 미리보기.
**쓰는 웹기술**: Web Share API, Clipboard API, Canvas(이미지 생성)·`toBlob`·`File`, Metadata API(OG)
**참고**: [Day 4 §4·§5](./day-4-browser-web-apis.md), [Day 3 §2.3(Metadata)](./day-3-nextjs-tailwind.md), [Web API 레퍼런스](./web-apis-reference.md), 우리 `src/lib/share.ts`·`src/components/panels/SharePanel.tsx`

**TODO**
- [ ] `share.ts`: `renderShareCard()` — canvas에 배경·펫(SVG를 Image로 로드해 `drawImage`)·정화량 텍스트를
      그려 `toBlob` → `File`. → 우리 `renderShareCard` 응용.
- [ ] `shareNative(text, url, files?)`: `navigator.share` + `canShare({files})` 탐지, 미지원 시 다운로드 폴백.
- [ ] `copyLink()`: `navigator.clipboard.writeText` + `execCommand` 폴백(try/catch).
- [ ] `layout.tsx`의 `metadata`에 `openGraph`·`twitter` + 정적 OG 이미지. 링크 미리보기 확인.

**완료 기준**: "카드로 자랑" 시 이미지가 생성되고 공유/다운로드된다. 링크를 붙이면 미리보기가 뜬다.
**막히면**: 우리 `share.ts`·`SharePanel.tsx`, [Day 4 §4](./day-4-browser-web-apis.md).

---

## M10 — 알림 & 오프라인 정산

**목표**: 재회 윈도우가 열릴 때 로컬 알림, 앱을 떠났다 오면 그동안의 수거·편지를 정산.
**쓰는 웹기술**: Notification API, Page Visibility(`visibilitychange`), 시간 계산(순수 함수)
**참고**: [Day 4 §5](./day-4-browser-web-apis.md), [Web API 레퍼런스](./web-apis-reference.md), 우리 `src/lib/notify.ts`·`src/hooks/useGame.ts`

**TODO**
- [ ] `notify.ts`: 권한(`Notification.requestPermission`) 요청, 재회 진입 시 `showNotification`.
      **탭이 보일 땐(`visibilityState`) 알림 억제.**
- [ ] `useGame`: `visibilitychange`에서 복귀 시 `settle()` 재실행(오프라인 정산). 정산 결과 모달로 표시.
- [ ] 알림 on/off 토글을 설정에 추가(localStorage 저장).

**완료 기준**: 다른 탭을 보다 재회 시간이 되면 알림이 오고, 오래 떠났다 오면 "그동안 N개 수거" 모달이 뜬다.
**막히면**: 우리 `notify.ts`·`useGame.ts`의 `visibilitychange`, [Day 4 §5](./day-4-browser-web-apis.md).

---

## M11 — 마무리 (빌드·품질·배포)

**목표**: 타입·린트·성능·접근성을 점검하고 배포한다.
**쓰는 웹기술**: 빌드 파이프라인, Lighthouse, 접근성(aria/시맨틱), 배포(Vercel)
**참고**: [Day 5 §4~6](./day-5-architecture-i18n-perf-capstone.md), 우리 `package.json`·`next.config.ts`

**TODO**
- [ ] `npm run build`(타입 통과)·`npm run lint`(0 경고).
- [ ] 아이콘 버튼에 `aria-label`, 장식 SVG/이미지에 `aria-hidden`/`alt=""` 점검([HTML 기초 §4](./foundations-html.md)).
- [ ] 크롬 **Lighthouse**로 성능·접근성·PWA 점수 측정. `First Load JS` 확인([Day 5 §4](./day-5-architecture-i18n-perf-capstone.md)).
- [ ] `next.config.ts`로 `package.json` 버전을 env에 주입([Day 3 §4](./day-3-nextjs-tailwind.md)), 화면에 버전 표기.
- [ ] (선택) GitHub에 올리고 Vercel로 배포. env 설정.

**완료 기준**: 빌드·린트 통과, Lighthouse PWA "설치 가능", 접근성 90+, 실제 URL에서 동작.
**막히면**: [Day 5](./day-5-architecture-i18n-perf-capstone.md).

---

## 🎓 완주 후 — 기술 커버리지 자가 점검

각 항목을 **당신 프로젝트에서 어디에 구현했는지** 말할 수 있으면 진짜 완주다:

- [ ] **HTML**: 시맨틱 태그·controlled input·접근성 속성 → 어느 화면?
- [ ] **CSS**: Flexbox 레이아웃·`@keyframes`·CSS 변수/토큰·position → 어디?
- [ ] **JS/TS**: union·`Record`·`typeof` 타입·클로저·불변 업데이트 → 어디?
- [ ] **React**: `useState`/`useEffect`/`useRef`·커스텀 훅·조건부 렌더·`key` → 어디?
- [ ] **Next.js**: App Router·Metadata·manifest·정적 생성·env 주입 → 어디?
- [ ] **SVG vs Canvas**: 선언형 펫 vs 명령형 게임 루프+델타타임 → 각각 어디?
- [ ] **Web API**: localStorage·Notification·Web Share·Clipboard·WAAPI·Vibration·Intl·visibilitychange → 각각 어디?
- [ ] **PWA**: manifest·서비스워커 캐시 전략·설치/업데이트 → 어디?
- [ ] **i18n**: Context·타입안전 카탈로그·`Intl`·RTL → 어디?

전부 답할 수 있으면 — 축하한다. 당신은 이 스택의 **모든 기술을 손으로 통과**한 1티어다. 🚀

---

## 부록 — 막힘 탈출 프로토콜

1. **에러 메시지를 읽어라.** TS/빌드 에러는 대개 "무엇이·어디서" 틀렸는지 알려준다(캡스톤의 그 느낌).
2. **개발자도구(F12)** — Elements(HTML)·Styles(CSS)·Console(JS 에러)·Network·Application(localStorage·SW).
3. **우리 문서 → 우리 코드 순으로.** 먼저 해당 Day/Foundations 문서, 그다음 정답지 소스.
4. **작게 격리해 재현.** 안 되는 부분만 떼어 콘솔·별도 컴포넌트에서 테스트.
5. **그래도 막히면** 정답지 파일을 **읽고 닫은 뒤** 기억으로 재작성. 복붙은 마지막의 마지막에도 하지 마라.

← [인덱스로](./README.md) · 관련: [Day 5 캡스톤](./day-5-architecture-i18n-perf-capstone.md)
