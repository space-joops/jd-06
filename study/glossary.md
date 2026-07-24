# 용어집 — 웹/프론트엔드 (한 ↔ 영)

← [인덱스로](./README.md)

초심자가 자주 막히는 프론트엔드 용어를 한국어 설명 + 영어 표기로 정리했다. 이 프로젝트의
어디서 쓰이는지도 함께.

---

## 언어 · 런타임

- **DOM (Document Object Model, 문서 객체 모델)** — 브라우저가 HTML을 트리 구조 객체로 표현한 것.
  화면 요소 = DOM 노드. React는 이 DOM을 대신 관리한다.
- **이벤트 루프 (event loop)** — 브라우저가 클릭·타이머·네트워크 응답을 순서대로 처리하는 상시
  반복. Python asyncio 이벤트 루프의 항상 도는 버전.
- **메인 스레드 (main thread)** — JS 실행 + UI 그리기를 담당하는 단일 스레드. 여기서 오래 걸리면
  화면이 멈춘다(freeze).
- **트랜스파일 (transpile)** — TS→JS, 최신 JS→구형 JS로 변환. `tsc`/번들러가 함.
- **번들러 (bundler)** — 여러 모듈을 브라우저가 로드할 파일로 묶는 도구. 이 프로젝트는 **Turbopack**.
- **HMR (Hot Module Replacement)** — 저장 시 새로고침 없이 바뀐 모듈만 교체. `npm run dev`의 즐거움.
- **트리 셰이킹 (tree shaking)** — 안 쓰는 코드를 번들에서 제거해 크기를 줄임.
- **폴리필 (polyfill)** — 구형 브라우저에 없는 최신 API를 코드로 채워 넣는 것.
- **폴백 (fallback)** — 기능이 없을 때의 대체 경로 (예: `clipboard` 없으면 `execCommand`).
- **기능 탐지 (feature detection)** — API 존재를 먼저 확인하고 쓰는 방어 패턴 (`navigator.vibrate?.()`).

## 타입 (TypeScript)

- **union 타입** — "A 또는 B" (`"a" | "b"`). Python `Literal`/`Union`.
- **discriminated union (판별 유니온)** — 공통 판별 필드로 갈라지는 union. `switch`로 안전 분기.
- **interface / type** — 객체 구조 타입. `TypedDict`/`dataclass` 대응.
- **generic (제네릭)** — 타입 매개변수 `<T>`. `Record<K, V>`, `useState<T>`.
- **`as const`** — 값을 가장 좁은 리터럴 + 불변으로 고정.
- **`typeof` 타입** — 값에서 타입을 추출 (`type Messages = typeof ko`).
- **narrowing (좁히기)** — 조건 검사로 union을 구체 타입으로 좁힘.
- **strict mode** — 엄격 타입 검사 (mypy --strict). 이 프로젝트 on.

## React

- **컴포넌트 (component)** — JSX를 반환하는 함수. UI의 단위.
- **JSX** — JS 안에 HTML 같은 문법. `<div>{x}</div>`.
- **props** — 부모→자식으로 내려주는 읽기 전용 데이터.
- **state (상태)** — 컴포넌트가 기억하는 값. 바뀌면 리렌더.
- **hook (훅)** — `use~`로 시작하는 특수 함수. 상태·부수효과를 함수 컴포넌트에 부여.
- **리렌더 (re-render)** — 상태/props 변경 시 컴포넌트 함수 재실행. 상태 유지됨.
- **리마운트 (re-mount)** — 컴포넌트가 새로 생성됨. 상태 초기화.
- **재조정 (reconciliation)** — React가 이전/새 결과를 비교해 바뀐 DOM만 갱신.
- **key** — 리스트 항목의 정체성 (리렌더 vs 리마운트 결정).
- **부수효과 (side effect)** — 렌더 밖의 작업(네트워크·타이머·저장). `useEffect`가 담당.
- **의존성 배열 (dependency array)** — `useEffect(fn, [deps])`의 실행 시점 제어 배열.
- **클린업 (cleanup)** — 이펙트가 반환하는 정리 함수(타이머·구독 해제).
- **stale closure (오래된 클로저)** — 콜백이 옛 상태를 붙잡는 버그. `ref`로 회피.
- **prop drilling** — props를 여러 단계 아래로 전달. 깊으면 Context로 대체.
- **Context** — prop drilling 없이 전역값 공유 (`createContext`/`useContext`).
- **불변 업데이트 (immutable update)** — 원본 대신 새 객체/배열을 만들어 setState.
- **controlled/uncontrolled** — 폼 값을 state로 제어하냐(controlled) 아니냐.
- **memoization (메모이제이션)** — `useMemo`/`useCallback`/`React.memo`로 재계산·리렌더 방지.

## Next.js

- **App Router** — `src/app/` 폴더=라우트 방식의 라우팅.
- **Server Component** — 서버에서만 실행(기본). JS 번들 0.
- **Client Component** — `"use client"`. 브라우저에서 실행, 훅·이벤트 사용.
- **RSC (React Server Components)** — 서버 컴포넌트 아키텍처의 약칭.
- **SSR / SSG / CSR / ISR** — 서버렌더 / 정적생성 / 클라이언트렌더 / 증분정적재생성.
- **hydration (하이드레이션)** — 서버가 보낸 HTML에 클라이언트 JS가 "생명을 불어넣어" 인터랙티브화.
- **Metadata API** — `metadata` 객체로 `<head>`/OG 태그 생성.
- **First Load JS** — 첫 페이지 로드에 필요한 JS 총량 (성능 지표).

## CSS · Tailwind

- **유틸리티 우선 (utility-first)** — 작은 단일 목적 클래스를 조합 (`flex`, `p-4`, `text-mint`).
- **`@theme`** — Tailwind v4의 디자인 토큰 정의(CSS 변수 → 유틸리티 생성).
- **디자인 토큰 (design token)** — 색·간격 등을 이름으로 관리하는 변수.
- **변형 (variant)** — 상태/조건 접두사 (`hover:`, `active:`, `sm:`, `rtl:`, `disabled:`).
- **논리 속성 (logical properties)** — 방향 무관 CSS (`margin-inline-start`=`ms-`). RTL 자동 대응.
- **브레이크포인트 (breakpoint)** — 반응형 경계 (`sm`, `md`, `lg`).
- **keyframes** — CSS 애니메이션 정의(`@keyframes`). 선언형 애니메이션.

## 그래픽 · 게임

- **SVG** — XML 기반 벡터 그래픽. DOM의 일부, 선언형, 확대 무손실.
- **Canvas** — JS로 픽셀을 그리는 명령형 API. 게임·대량 렌더용.
- **viewBox** — SVG 내부 좌표계.
- **스프라이트 (sprite)** — 미리 그려둔 이미지 조각 (게임에서 blit).
- **rAF (requestAnimationFrame)** — 다음 화면 그리기 직전 콜백. 게임 루프.
- **델타타임 (delta time, dt)** — 프레임 간 경과 시간. 프레임레이트 독립 물리의 핵심.
- **DPR (devicePixelRatio)** — 물리:논리 픽셀 비율(레티나 대응).

## PWA · Web API

- **PWA (Progressive Web App)** — 설치·오프라인 가능한 웹앱.
- **서비스워커 (service worker)** — 백그라운드에서 요청을 가로채 캐싱하는 스크립트.
- **매니페스트 (manifest)** — PWA 메타(이름·아이콘·표시모드) JSON.
- **network-first / cache-first** — 서비스워커 캐시 전략(네트워크 우선 / 캐시 우선).
- **Web Share / Clipboard / Notification / Vibration** — 각각 공유·복사·알림·진동 브라우저 API.
- **WAAPI (Web Animations API)** — `element.animate(...)` 명령형 애니메이션.
- **Intl** — 로케일별 숫자·날짜 포맷 내장 API.

## 국제화 (i18n)

- **i18n / l10n** — internationalization(국제화, 다국어 구조) / localization(현지화, 실제 번역).
- **locale (로케일)** — 언어+지역 식별자 (`ko`, `en`, `ar-EG`).
- **RTL / LTR** — Right-to-Left(아랍어 등) / Left-to-Right(대부분).
- **카탈로그 (catalog)** — 키→번역문 매핑 (`messages/{locale}.ts`).
- **보간 (interpolation)** — 문구에 변수 치환 (`"{name}님"`).
- **폴백 체인 (fallback chain)** — 번역 없으면 상위 언어로 (현재→en→ko→키).

## 도구 · 워크플로

- **npm / node_modules** — 패키지 매니저 / 설치된 의존성 (pip / venv).
- **package.json / lock** — 의존성·스크립트 정의 / 정확한 버전 잠금.
- **ESLint / Prettier** — 린트(버그·스타일) / 포매터 (ruff / black).
- **semver** — 시맨틱 버저닝 `major.minor.patch` (`^5`=5.x 호환).
- **a11y** — accessibility(접근성)의 약어 (a…11글자…y).
- **Lighthouse** — 크롬의 성능·접근성·PWA 점수 측정 도구.

---

← [인덱스로](./README.md) · [치트시트](./cheatsheet-python-to-web.md) · [Web API 레퍼런스](./web-apis-reference.md)
