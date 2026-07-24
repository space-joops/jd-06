# 아스트로펫으로 배우는 웹/프론트엔드 마스터 (5일 커리큘럼)

> **대상 독자**: Python 백엔드·데이터 엔지니어 → 5일 만에 "1티어" 프론트엔드 개발자로
> **교보재(vehicle)**: 이 저장소(아스트로펫 — Next.js 15 + React 19 + TypeScript PWA 게임)
> **방식**: 실습 중심 — 실제 프로젝트 코드를 정독·추적·수정하고, 5일차에 end-to-end 캡스톤

---

## 0. 이 커리큘럼을 쓰는 법

당신은 이미 **프로그래밍의 어려운 절반**(자료구조, 알고리즘, 비동기, 타입, 아키텍처, 테스트)을
Python으로 알고 있다. 프론트엔드가 낯선 건 *어려워서*가 아니라 **런타임과 사고방식이 다르기**
때문이다. 그래서 이 문서는 매 개념을 **Python에 대응(bridge)** 시키며 진행한다.

각 Day 문서는 이 구조를 따른다:

1. **학습 목표** — 오늘 끝나면 할 수 있는 것
2. **Python 개발자를 위한 멘탈 모델 브릿지** — 익숙한 개념으로 새 개념 잡기
3. **핵심 개념** — 이 프로젝트의 실제 코드(파일 경로 명시)로 설명
4. **실습** — 정독 → 코드 추적 → 소규모 수정 (단계별)
5. **연습문제** — 도전 과제 + 예상 소요시간
6. **자가 체크리스트** — "이제 나는 ~할 수 있다"
7. **더 읽기** — MDN·공식 문서 링크

> 💡 **읽지만 말고 만지세요.** 하루 3~4시간 중 최소 절반은 에디터에서 코드를 바꾸고
> `npm run dev`로 결과를 보는 데 쓰는 게 목표다. 이론만 읽으면 3티어에서 멈춘다.

---

## 1. 사전 준비 (Day 1 시작 전 1회)

```bash
# Node.js 20+ 설치 확인 (Python의 python3 --version 에 해당)
node --version    # v20 이상
npm --version

# 저장소 의존성 설치 (pip install -r requirements.txt 에 해당)
npm install

# 개발 서버 실행 (uvicorn/flask run 에 해당) — 저장하면 자동 새로고침(HMR)
npm run dev
# → http://localhost:3000 을 브라우저로 열어 게임을 직접 플레이해 본다
```

프로덕션 빌드·타입체크·린트도 미리 한 번 돌려 감을 잡아두면 좋다:

```bash
npm run build     # 타입체크 포함 프로덕션 빌드 (mypy + 패키징 에 해당)
npm run lint      # 정적 분석 (ruff/flake8 에 해당)
npx next start    # 빌드 결과 실행 (SW/PWA는 여기서만 동작)
```

> **디렉터리 지도** (오늘부터 자주 열 파일들)
> - `src/lib/` — 순수 로직·타입 (가장 Python다운 곳, Day 1)
> - `src/hooks/` — 재사용 상태 로직 (Day 2)
> - `src/components/` — UI 컴포넌트 (Day 2~4)
> - `src/app/` — Next.js 라우팅·메타데이터·전역 CSS (Day 3)
> - `src/i18n/` — 국제화 (Day 5)
> - `public/sw.js` — 서비스워커 (Day 4)

---

## 2. 5일 일정표

| Day | 주제 | 한 줄 요약 | 문서 |
|---|---|---|---|
| **1** | **JavaScript & TypeScript** | 언어·비동기·타입·툴체인을 Python과 대조하며 장착 | [day-1](./day-1-javascript-typescript.md) |
| **2** | **React 19** | "UI = f(state)" 선언적 사고와 Hooks, 커스텀 훅 | [day-2](./day-2-react.md) |
| **3** | **Next.js 15 & Tailwind CSS v4** | App Router·렌더링 전략·유틸리티 우선 CSS | [day-3](./day-3-nextjs-tailwind.md) |
| **4** | **브라우저 플랫폼 & Web APIs** | DOM·Canvas+rAF·SVG·PWA·수많은 Web API | [day-4](./day-4-browser-web-apis.md) |
| **5** | **아키텍처·i18n·성능 + 캡스톤** | 계층 설계·국제화·성능·접근성 + 전 계층 실습 | [day-5](./day-5-architecture-i18n-perf-capstone.md) |

### 곁에 두고 보는 레퍼런스

- 🔁 [**Python → Web 치트시트**](./cheatsheet-python-to-web.md) — 문법·자료구조·비동기·타입 대조표
- 🌐 [**Web API 레퍼런스**](./web-apis-reference.md) — 이 프로젝트에서 쓴 브라우저 API + 파일 경로
- 📖 [**용어집**](./glossary.md) — 한↔영 프론트엔드 용어

> ⏱️ **추천 페이스**: 하루 3~4시간 × 5일 = 약 15~20시간. 시간이 부족하면 각 Day의 "핵심 개념 +
> 실습"만 먼저 하고 "연습문제"는 주말에 몰아서 해도 된다. 단, **캡스톤(Day 5)은 반드시** 손으로 할 것.

---

## 3. 이 프로젝트가 훌륭한 교재인 이유

작지만(한 화면짜리 게임) **1티어 프론트엔드의 핵심 기술이 거의 다 실전으로** 들어있다:

- **React 19 + Hooks + 커스텀 훅** — 상태·부수효과·재사용 로직 (`src/hooks/`)
- **TypeScript strict** — union·generic·discriminated union·`typeof` 타입 (`src/lib/types.ts`)
- **Next.js 15 App Router** — 메타데이터·매니페스트·정적 생성 (`src/app/`)
- **Tailwind CSS v4** — 유틸리티 우선·디자인 토큰(`@theme`) (`src/app/globals.css`)
- **Canvas 2D + requestAnimationFrame 게임 루프** — 명령형 렌더·델타타임 물리 (`src/components/SpacewalkGame.tsx`)
- **SVG 아트** — 선언형 벡터 그래픽 (`src/components/PetSvg.tsx`, `src/lib/debris.ts`)
- **PWA** — 서비스워커·캐시 전략·설치/업데이트 (`public/sw.js`, `src/hooks/usePwa.ts`)
- **다수의 Web API** — localStorage·Notification·Web Share·Clipboard·Web Animations·Vibration·Intl
- **국제화(i18n)** — React Context·타입안전 메시지 카탈로그·`Intl`·RTL(아랍어) (`src/i18n/`)
- **접근성·성능·배포** — aria·번들 최적화·Vercel·서비스워커 버전 케이던스

---

## 4. "1티어" 도달 기준 (자가 평가 루브릭)

5일 뒤, 아래를 **막힘없이 설명하고 직접 구현**할 수 있으면 성공이다:

- [ ] `useEffect`의 의존성 배열과 클린업이 언제·왜 실행되는지 설명하고, stale closure 버그를 피할 수 있다
- [ ] "리렌더(re-render)"와 "리마운트(re-mount)"의 차이, `key`의 역할을 안다
- [ ] Server Component와 Client Component(`"use client"`)의 경계와 트레이드오프를 안다
- [ ] Canvas 게임 루프에서 왜 델타타임(`dt`)으로 물리를 계산하는지 안다
- [ ] 서비스워커의 install/activate/fetch 라이프사이클과 캐시 전략을 설명할 수 있다
- [ ] TypeScript union·discriminated union·`typeof` 타입을 실전에서 쓴다
- [ ] 새 기능을 `lib → hook → component → i18n → build` 전 계층으로 추가할 수 있다 (캡스톤)
- [ ] 번들 크기·First Load JS·리렌더를 의식하며 코드를 짠다

---

## 5. 학습 원칙 (백엔드 개발자가 자주 걸리는 지점)

1. **선언형으로 사고하라.** 백엔드/스크립트는 "이걸 해라"(명령형)지만 React는 "상태가 이러면
   화면은 이렇다"(선언형)다. DOM을 직접 조작하려는 본능을 참고, **상태를 바꾸면 UI가 따라온다**고
   믿어라. (예외: `SpacewalkGame`의 Canvas는 성능 때문에 의도적으로 명령형 — Day 4에서 다룸.)
2. **브라우저는 죽지 않는 이벤트 루프다.** Python 스크립트는 실행되고 끝나지만, 브라우저 탭은
   계속 살아서 이벤트(클릭·타이머·네트워크)를 기다린다. asyncio 이벤트 루프의 상시 버전이라 보면 된다.
3. **타입을 무기로 써라.** 당신은 타입힌트에 익숙하다. TS는 그걸 **컴파일 타임에 강제**한다 —
   `type Messages = typeof ko` 하나로 10개 언어 번역 누락을 빌드가 잡아준다(Day 5).
4. **작게 바꾸고 즉시 확인하라.** HMR 덕분에 저장하는 순간 반영된다. 데이터 파이프라인을
   셀 단위로 검증하듯, UI도 한 조각씩 바꿔 눈으로 확인하라.

---

## 6. 5일 이후 로드맵 (1티어 유지·확장)

이 커리큘럼이 다루지 않는(이 프로젝트에 없는) 주제는 다음 순서로 확장하면 좋다:

1. **데이터 페칭 & 서버 상태** — `fetch`, TanStack Query(React Query), SWR (데이터 엔지니어에게 자연스러운 다음 단계)
2. **폼 & 검증** — React Hook Form + Zod (Pydantic과 유사한 스키마 검증)
3. **테스트** — Vitest(단위) + Playwright(E2E) + React Testing Library
4. **상태 관리 라이브러리** — Zustand / Jotai / Redux Toolkit (언제 필요한지 Day 5에서 다룸)
5. **서버 컴포넌트 & 풀스택 Next.js** — Server Actions, DB 연동, 인증
6. **애니메이션·인터랙션** — Framer Motion, CSS transitions 심화
7. **디자인 시스템** — 접근성(a11y), 컴포넌트 라이브러리(Radix, shadcn/ui)

---

즐겁게, 그리고 **손으로** 배우시길. Day 1으로 →
[day-1-javascript-typescript.md](./day-1-javascript-typescript.md)
