# Day 3 — Next.js 15 (App Router) & Tailwind CSS v4

← [Day 2](./day-2-react.md) · [인덱스](./README.md) · 다음 → [Day 4](./day-4-browser-web-apis.md)

> **예상 소요**: 3.5시간 (Next.js 2h + Tailwind 1h + 실습 0.5h)
> **교보재 파일**: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/manifest.ts`,
> `next.config.ts`, `src/app/globals.css`

---

## 학습 목표

- Next.js **App Router**의 파일 규약(`layout`·`page`)과 **Server/Client Component** 경계를 안다
- **Metadata API**·`manifest.ts`로 SEO·PWA 메타를 코드로 관리하는 법을 안다
- 렌더링 전략(SSR/SSG/CSR)을 개념으로 구분하고, 이 앱이 왜 client-heavy인지 안다
- **Tailwind CSS v4**의 유틸리티 우선·`@theme` 디자인 토큰을 읽고 쓴다

---

## 1. 멘탈 모델 브릿지 — 프레임워크로서의 Next.js

Next.js는 **React용 풀스택 프레임워크**다. Django/FastAPI가 라우팅·미들웨어·빌드·배포를
묶어주듯, Next는 **라우팅·번들링·서버렌더링·이미지최적화·메타데이터**를 묶어준다.

| Django/FastAPI | Next.js (App Router) |
|---|---|
| URL 라우팅 (urls.py / 데코레이터) | **폴더 구조 = 라우트** (`src/app/`) |
| 템플릿 렌더 (서버) | Server Component (기본, 서버 렌더) |
| 정적 파일 (`static/`) | `public/` |
| `settings.py` | `next.config.ts` |
| 미들웨어 | `middleware.ts` (이 프로젝트엔 없음) |
| gunicorn/uvicorn | `next start` (Node 서버) 또는 정적 배포 |

이 프로젝트는 **한 화면짜리 클라이언트 게임**이라 라우팅은 최소지만, Next의 메타데이터·PWA·
빌드 파이프라인을 알차게 쓴다.

---

## 2. App Router — 폴더가 곧 URL

`src/app/` 아래 특수 파일 이름이 규약이다:

```
src/app/
  layout.tsx    ← 모든 페이지를 감싸는 공통 껍데기 (<html><body>)
  page.tsx      ← "/" 경로의 페이지
  globals.css   ← 전역 스타일
  manifest.ts   ← /manifest.webmanifest 를 생성 (PWA)
  favicon.ico
```

- 폴더를 만들면 경로가 생긴다: `app/about/page.tsx` → `/about`. `[id]` 폴더는 동적 세그먼트.
  (이 게임은 단일 페이지라 하위 라우트가 없다.)
- `layout.tsx`는 자식을 `children`으로 받아 감싼다 (중첩 레이아웃 가능).

### 2.1 `page.tsx` — 트리비얼한 진입점

```tsx
import Game from "@/components/Game";
export default function Home() {
  return <Game />;
}
```

이건 **Server Component**(지시어 없음)지만, `<Game/>`이 `"use client"`라 실제 게임 로직은
브라우저에서 돈다. 서버는 초기 HTML 껍데기만 만든다.

### 2.2 `layout.tsx` — HTML 문서 골격 + 폰트 + 메타데이터

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
```

- `next/font/google` — **웹폰트를 빌드시 최적화**해 CSS 변수(`--font-geist-sans`)로 노출.
  (FOUT 방지, 셀프호스팅, 요청 0회) — 프레임워크가 주는 공짜 성능.
- `<html lang="en" dir="ltr">` — 기본 로케일. 런타임에 i18n이 이 `lang`/`dir`을 갱신한다(Day 5).

### 2.3 Metadata API — SEO/OG를 타입 안전하게

`layout.tsx`가 export하는 `metadata` 객체가 `<head>` 태그로 렌더된다:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Astropet",
  description: "A cozy game where you bond with a pet that feeds on space debris.",
  openGraph: { type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1026" };
```

`<meta property="og:image" ...>`를 손으로 쓰는 대신 **객체로 선언**하면 Next가 정확한 태그를
생성한다. 카카오톡/트위터 링크 미리보기가 이걸로 뜬다 (`public/og.png`는 1200×630 정적 이미지).

### 2.4 `manifest.ts` — 코드로 PWA 매니페스트 생성

```tsx
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Astropet",
    display: "standalone",       // 홈 화면 앱처럼 (주소창 없이)
    orientation: "portrait",
    background_color: "#0b1026",
    theme_color: "#0b1026",
    icons: [ { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, /* ... */ ],
  };
}
```

`app/manifest.ts`는 `/manifest.webmanifest` URL로 서빙된다 (파일 기반 특수 라우트). PWA 설치의
근거가 되는 파일 (Day 4).

---

## 3. Server vs Client Component (핵심 개념)

Next.js 15의 가장 중요한 모델:

| | Server Component (기본) | Client Component (`"use client"`) |
|---|---|---|
| 실행 위치 | **서버에서만** | 서버(초기 HTML) + **브라우저** |
| 쓸 수 있는 것 | DB·파일·비밀키·`async` 직접 | `useState`/`useEffect`·이벤트·브라우저 API |
| 못 쓰는 것 | 훅·이벤트·`window` | DB·비밀키 (번들에 노출됨) |
| 번들 크기 | JS 0 (HTML만) | JS가 클라이언트로 전송됨 |

- 파일 맨 위 `"use client"`가 그 컴포넌트(+import하는 하위)를 클라이언트로 만든다.
- **이 프로젝트가 client-heavy인 이유**: 게임이라 상태·타이머·Canvas·localStorage가 필수.
  그래서 `Game.tsx`부터 `"use client"`이고, 사실상 SPA(단일 페이지 앱)처럼 동작한다.
- **일반 앱의 모범**: 페이지 골격·데이터 페칭은 Server Component로 두고, 인터랙티브한 잎사귀만
  Client Component로 만들어 **전송 JS를 최소화**한다. (이 게임은 특수 케이스)

> 데이터 엔지니어 비유: Server Component = "서버에서 미리 계산해 결과 HTML만 내려보냄"(무거운
> 집계를 서버에서), Client Component = "브라우저에서 인터랙티브하게 갱신"(대시보드 위젯).

---

## 4. 렌더링 전략 & 빌드

- **SSG(정적 생성)**: 빌드 시 HTML을 미리 생성. 이 앱이 그렇다 — `npm run build` 결과에
  `○ (Static) prerendered as static content`가 뜬다. 서버 없이 CDN에 올려도 된다.
- **SSR(서버 렌더)**: 요청마다 서버가 HTML 생성 (개인화·실시간 데이터).
- **CSR(클라이언트 렌더)**: 브라우저에서 JS로 렌더 (이 게임의 실제 동작 — 껍데기는 SSG, 내용은 CSR).
- **ISR**: 정적 + 주기적 재생성.

### `next.config.ts` — 빌드시 버전 주입 (영리한 트릭)

```ts
const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const nextConfig: NextConfig = { env: { NEXT_PUBLIC_APP_VERSION: version } };
```

`package.json`의 `version`을 읽어 **환경변수로 인라인**한다. 그래서 `src/lib/version.ts`의
`APP_VERSION`이 항상 패키지 버전과 일치하고, 화면 하단·서비스워커 캐시 이름에 쓰인다.
`NEXT_PUBLIC_` 접두사가 붙은 env만 **브라우저 번들에 노출**된다 (나머지는 서버 전용 — 비밀키 보호).

- **Turbopack**: 이 프로젝트의 `dev`/`build`가 쓰는 차세대 번들러(웹팩 후계). Vite와 유사하게 빠르다.

---

## 5. Tailwind CSS v4 — 유틸리티 우선 스타일링

CSS 파일을 따로 쓰지 않고, **작은 유틸리티 클래스**를 마크업에 조합한다. 백엔드 개발자가
"CSS 이름 짓기 지옥"을 건너뛰게 해주는 실용적 접근이다.

```tsx
<button className="flex-1 rounded-xl bg-mint py-3 text-sm font-bold text-space-900 active:scale-95 disabled:opacity-35">
```

| 클래스 | 의미 |
|---|---|
| `flex`, `flex-col`, `items-center` | flexbox 레이아웃 |
| `rounded-xl` | border-radius |
| `bg-mint`, `text-space-900` | 배경·글자색 (커스텀 토큰!) |
| `py-3`, `px-5`, `gap-2` | padding / gap (4px 단위 스케일) |
| `text-sm`, `font-bold` | 폰트 크기·굵기 |
| `active:scale-95` | **눌렸을 때** 95% 축소 (상태 변형) |
| `disabled:opacity-35` | disabled일 때 투명도 |
| `sm:border-x` | `sm` 브레이크포인트 이상에서만 |
| `max-w-[430px]`, `z-[60]` | **임의값** (대괄호) |

### 5.1 `@theme` — 디자인 토큰 (v4의 핵심)

`src/app/globals.css`:

```css
@import "tailwindcss";           /* v4는 이 한 줄 (설정 파일 불필요) */

@theme inline {
  --color-space-900: #0b1026;    /* → bg-space-900 / text-space-900 유틸 생성 */
  --color-mint: #7de8c3;         /* → bg-mint / text-mint */
  --color-pinkish: #f9a8d4;
  --font-sans: var(--font-geist-sans);
}
```

`@theme`에 CSS 변수를 정의하면 Tailwind가 **자동으로 유틸리티 클래스를 만든다**. 그래서
`tailwind.config.js` 없이도 `bg-mint`가 동작한다 (v4의 새 방식). 디자인 토큰을 한 곳에서 관리 =
브랜드 색을 바꾸면 전 화면이 바뀐다.

### 5.2 커스텀 CSS·애니메이션은 여전히 CSS로

유틸리티로 안 되는 것(keyframe 애니메이션, 복잡한 그라디언트)은 `globals.css`에 직접 쓴다:

```css
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
.anim-bob { animation: bob 3s ease-in-out infinite; }
```

컴포넌트에선 `<div className="anim-bob">`. (Day 4에서 CSS 애니메이션 vs Canvas를 대조한다.)

### 5.3 논리 속성 & RTL (Day 5 예습)

`ms-1`(margin-inline-start), `text-start`, `rtl:-translate-x-5` 같은 **방향 무관 유틸리티**가
아랍어(RTL)에서 자동으로 좌우가 뒤집힌다. i18n의 RTL 지원이 여기 기댄다.

---

## 6. 실습

### 실습 A — 메타데이터·매니페스트 읽기 (30분)

1. `src/app/layout.tsx`의 `metadata`를 읽고, 브라우저 개발자도구 → Elements → `<head>`에서
   실제로 생성된 `<meta>` 태그들과 대조하라.
2. `npm run dev` 후 브라우저에서 `/manifest.webmanifest`를 직접 열어(주소창에 입력) `manifest.ts`가
   만든 JSON을 확인하라.
3. `next.config.ts` → `version.ts` → 화면 하단 `v0.8.0` 표기까지 버전이 흐르는 경로를 추적하라.

### 실습 B — Tailwind 만지기 (30분)

> ⚠️ 확인 후 `git checkout .`.

1. `globals.css`의 `--color-mint`를 다른 색(`#ff9de2`)으로 바꾸고 `npm run dev`로 전 화면 민트
   요소가 바뀌는지 보라. **토큰 하나로 브랜드 변경**을 체감.
2. 아무 버튼의 `className`에서 `active:scale-95`를 지우고, 눌러도 안 줄어드는 걸 확인 → 다시 넣기.
3. `rounded-xl`을 `rounded-none` ↔ `rounded-full`로 바꿔 모서리 변화를 보라.

---

## 7. 연습문제

1. **(20분)** Server Component와 Client Component의 차이를 표로 정리하고, 이 게임이 왜 대부분
   `"use client"`인지, 일반 앱이라면 어디를 Server로 둘지 설명하라.
2. **(15분)** `metadata` 객체에 `keywords`와 새 OG 이미지 크기를 추가하는 코드를 써보라 (빌드 통과 확인).
3. **(20분)** `@theme`에 새 색 토큰 `--color-danger: #ff5555`를 추가하고, 초기화 버튼에 `bg-danger`를
   적용해보라. v4가 어떻게 설정 파일 없이 유틸리티를 만들어내는지 설명하라.

---

## 8. 자가 체크리스트

- [ ] App Router의 폴더=라우트, `layout`/`page` 규약을 안다
- [ ] Server/Client Component 경계와 `"use client"`의 의미·트레이드오프를 설명한다
- [ ] Metadata API·`manifest.ts`로 SEO/PWA 메타를 코드로 관리할 수 있다
- [ ] SSG/SSR/CSR을 구분하고 이 앱의 렌더링 방식을 안다
- [ ] Tailwind 유틸리티·변형(`active:`/`sm:`)·`@theme` 토큰을 읽고 쓴다

---

## 9. 더 읽기

- [Next.js — App Router 학습](https://nextjs.org/docs/app) (특히 Routing, Rendering, Metadata)
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs) (Utility-First, Theme)

다음 → [Day 4: 브라우저 플랫폼 & Web APIs](./day-4-browser-web-apis.md)
