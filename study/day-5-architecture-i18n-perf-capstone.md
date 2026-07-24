# Day 5 — 아키텍처 · i18n · 성능 + 캡스톤

← [Day 4](./day-4-browser-web-apis.md) · [인덱스](./README.md)

> **예상 소요**: 4~5시간 (개념 2h + **캡스톤 2~3h**)
> **교보재 파일**: `src/i18n/config.ts`, `src/i18n/I18nProvider.tsx`, `src/i18n/messages/ko.ts`,
> `src/components/panels/LanguagePanel.tsx`, 전체 `src/` 계층 구조

---

## 학습 목표

- 이 앱의 **계층 아키텍처**(lib/hooks/components/screens/panels)를 클린 백엔드 설계에 대응시켜 이해한다
- **라이브러리 없는 상태관리**의 한계와, 언제 Redux/Zustand/React Query가 필요한지 안다
- **국제화(i18n)** 를 React Context·타입안전 카탈로그·`Intl`·RTL로 직접 설명한다
- 성능(번들·리렌더·First Load JS)·접근성·배포·테스트의 실전 감각을 얻는다
- **캡스톤**: 새 기능을 `lib → 데이터 → i18n → UI → 빌드` 전 계층으로 추가한다

---

## 1. 아키텍처 — 계층 분리 (백엔드 감각 그대로)

이 프로젝트는 작지만 **관심사가 깔끔히 분리**돼 있다. 데이터 엔지니어가 ETL을 추출/변환/적재로
나누듯:

```
src/
  lib/         ← 순수 도메인 로직·타입 (React·브라우저 없음). 테스트 최적.
               game.ts(정산·궤도·액션), types.ts, constants.ts, letters.ts,
               debris.ts, satellites.ts, share.ts, storage.ts, notify.ts
  i18n/        ← 국제화 (Context·카탈로그)
  hooks/       ← lib와 React를 잇는 상태 계층 (useGame, usePwa, ...)
  components/  ← 순수 UI (PetSvg, OrbitView, Gauge) + 화면·패널
    screens/   ← 스테이지별 전체 화면
    panels/    ← 바텀시트 안 내용 (편지함, 도감, 설정, 공유)
  app/         ← Next.js 라우팅·메타데이터·전역 CSS
```

**핵심 설계 규약** (`docs/DEVELOPMENT.md`에도 문서화됨):

1. **`lib/`는 순수하다** — `Date.now()`조차 인자(`now`)로 주입받는다. 그래서 **테스트가 쉽다**
   (입력→출력만 검증). 부수효과(저장·타이머·알림)는 `hooks/`가 담당.
2. **불변 + 참조 판정** — 액션이 조건을 못 맞추면 원본을 그대로 반환하고, `useGame`이
   `next !== prev`로 성공을 판정한다 (Day 1·2에서 봄). **순수성이 UI 피드백을 공짜로 준다.**
3. **단방향 데이터 흐름** — 상태는 `useGame`에 모이고 props로 내려가며(prop drilling), 액션은
   `api.doX()`로 올라온다. 예측 가능.

> 이 분리가 왜 "1티어"인가: 게임 밸런스를 바꾸려면 `constants.ts`만, 새 규칙은 `game.ts`만,
> 새 화면은 `screens/`만 건드리면 된다. **변경의 파급을 계층이 가둔다.**

---

## 2. 상태 관리 — 라이브러리 없이, 그리고 그 한계

이 앱은 **Redux도 Zustand도 없이** React 훅 + localStorage만으로 상태를 관리한다. 가능한 이유:
상태가 하나의 트리(`GameState`)에 모여 있고, `useGame` 하나가 소유하기 때문.

**언제 상태 라이브러리가 필요해지나?** (면접 단골)

| 상황 | 도구 |
|---|---|
| 서로 먼 컴포넌트가 같은 전역 상태 공유 (prop drilling 지옥) | **Context**(이 앱의 i18n) / Zustand / Jotai |
| 복잡한 상태 전이·많은 액션 | `useReducer` / Redux Toolkit |
| **서버 데이터** 페칭·캐싱·재검증·낙관적 업데이트 | **TanStack Query(React Query)** / SWR |
| 폼 상태·검증 | React Hook Form + Zod |

> 데이터 엔지니어에게 특히 중요: **서버 상태(React Query)** 와 **클라이언트 상태(useState)** 는
> 다른 문제다. 이 게임은 서버가 없어 전부 클라이언트 상태다. 실무 앱에선 "API에서 온 데이터"는
> 거의 항상 React Query류로 관리한다 (캐시·중복요청 제거·백그라운드 갱신). 5일 이후 1순위 학습.

---

## 3. 국제화(i18n) — 이 프로젝트의 하이라이트

`src/i18n/`은 **무거운 라이브러리 없이** 만든 경량 i18n이다. 10개 언어(한·영·아랍어(RTL)·중·일·
스페인·프랑스·독일·포르투갈·러시아)를 지원하고, 브라우저 언어로 자동 선택 + 설정에서 전환된다.
Day 1~4의 모든 개념(union 타입·`typeof`·Context·`useMemo`·`Intl`·논리 CSS)이 여기 모인다.

### 3.1 언어 설정 & 자동 감지 (`config.ts`)

```ts
export const LOCALES = [
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },   // 아랍어: 오른쪽→왼쪽
  // ... 총 10개
] as const;
export const DEFAULT_LOCALE = "en";

export function detectLocale(): LocaleCode {
  // 1) 저장된 선택 → 2) navigator.languages 기본 서브태그 매칭 → 3) en 폴백
  const saved = localStorage.getItem("astropet-locale");
  if (saved && ...) return saved;
  for (const l of navigator.languages) {
    const base = l.toLowerCase().split("-")[0];   // "ko-KR" → "ko"
    if (...includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}
```

`as const`(Day 1) 덕에 `code`들이 정확한 union 타입 `LocaleCode`가 된다.

### 3.2 타입 안전 카탈로그 (`messages/*.ts`) — `typeof`의 진가

```ts
// ko.ts — 구조의 원본(source of truth)
const ko = {
  common: { close: "닫기" },
  gauge: { bond: "유대감", mood: "기분" },
  debris: { paint: { name: "페인트 조각", desc: "..." }, /* 7종 */ },
  // ... 약 190개 문자열
};
export type Messages = typeof ko;   // ← ko의 구조를 타입으로

// en.ts, ar.ts, ... — 이 타입을 만족해야 함
const en: Messages = { common: { close: "Close" }, ... };
```

**키가 하나라도 빠지면 `npm run build`가 실패한다.** 10개 언어 × 190키의 번역 누락을 사람이
아니라 **컴파일러가** 잡는다. (Day 1에서 예고한 킬러 패턴. Python엔 거의 없는 안전망.)

### 3.3 Provider — Context + `t()` + `Intl` (`I18nProvider.tsx`)

```tsx
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => { setLocaleState(detectLocale()); }, []);         // 하이드레이션 후 감지
  useEffect(() => {                                                 // <html> 갱신
    document.documentElement.lang = locale;
    document.documentElement.dir = dirOf(locale);                  // 아랍어면 "rtl"
  }, [locale]);

  const value = useMemo(() => {
    const t = (key: string, params?) => {                          // "gauge.mood" 점경로 조회
      const raw = resolve(MESSAGES[locale], key)                   // 현재 언어
              ?? resolve(MESSAGES.en, key)                         // → en 폴백
              ?? resolve(MESSAGES.ko, key) ?? key;                 // → ko 폴백 → 키 자체
      return interpolate(raw, params);                            // "{name}" 치환
    };
    const formatNumber = (n) => new Intl.NumberFormat(locale).format(n);
    const formatDate   = (d) => new Intl.DateTimeFormat(locale, {...}).format(d);
    return { locale, setLocale, t, formatNumber, formatDate };
  }, [locale]);                                                    // locale 바뀔 때만 재생성

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export const useI18n = () => useContext(I18nContext)!;
```

배운 것들이 총출동한다:
- **`createContext`/`useContext`** (Day 2 §3.5) — prop drilling 없이 `t()`를 어디서든.
- **`useMemo`** — `locale`이 바뀔 때만 `t`를 재생성 (불필요한 리렌더 방지).
- **`Intl.NumberFormat/DateTimeFormat`** (Day 4) — `1234`가 한국어 `1,234`, 독일어 `1.234`,
  아랍어 `١٬٢٣٤`로 자동 변환. 직접 포맷하지 마라.
- **`document.documentElement.dir`** — 아랍어에서 `rtl`을 켜면, Day 3의 논리 클래스(`ms-`/
  `text-start`)·`rtl:` 변형이 자동으로 좌우를 뒤집는다.

### 3.4 언어 전환 UI (`LanguagePanel.tsx`)

```tsx
export default function LanguagePanel() {
  const { t, locale, setLocale } = useI18n();
  return LOCALES.map((l) => (
    <button key={l.code} dir={l.dir} aria-pressed={l.code === locale}
            onClick={() => setLocale(l.code)}>
      {l.name}   {/* 각 언어를 그 언어 표기로: 한국어/English/العربية/日本語... */}
    </button>
  ));
}
```

`setLocale`이 localStorage에 저장 → 새로고침해도 유지. `aria-pressed`는 접근성(§5).

### 3.5 편지 i18n — 저장은 키, 표시는 번역

편지(`Letter`)는 완성된 텍스트가 아니라 **템플릿 키(`tkey`)** 를 저장한다. 렌더 시 `t(tkey)`로
현재 언어로 번역 → 언어를 바꾸면 **과거 편지도 그 언어로** 보인다. 레거시 세이브는 `title/body`로
폴백(마이그레이션 불필요). "데이터엔 참조를, 표시에서 해석"하는 좋은 패턴.

---

## 4. 성능 (1티어의 기본기)

- **번들 크기 / First Load JS**: `npm run build` 출력의 `First Load JS`(이 앱 ~178kB)를 주시하라.
  큰 라이브러리 추가 전에 비용을 재라. **코드 분할**: `next/dynamic`·`React.lazy`로 무거운
  컴포넌트를 지연 로드 (이 게임은 작아 안 씀).
- **리렌더 최소화**: 불필요한 리렌더를 `useMemo`/`useCallback`/`React.memo`로 줄인다. **단,
  측정 후에.** (Day 2 경고) `SpacewalkGame`은 아예 60fps를 ref+DOM으로 우회 (Day 4).
- **이미지·폰트**: `next/font`(Day 3)로 폰트 자동 최적화, 정적 `og.png`로 satori 런타임 렌더 회피.
- **측정 도구**: 크롬 DevTools의 **Lighthouse**(성능·접근성·PWA 점수), **Performance** 패널,
  React DevTools의 Profiler(어떤 컴포넌트가 왜 리렌더됐나).

---

## 5. 접근성(a11y) — 공짜로 얻는 품질

- **시맨틱 태그**: `<button>`(클릭), `<nav>`, `<header>`, `<h1>` — 스크린리더·키보드가 이해한다.
  `<div onClick>`보다 `<button>`을 써라 (이 프로젝트가 그렇게 함).
- **`aria-*`**: `aria-label`(아이콘 버튼 설명), `aria-pressed`(토글 상태, `LanguagePanel`),
  `aria-hidden`(장식용 SVG). `Sheet.tsx`의 닫기 버튼이 `aria-label`을 쓴다.
- **RTL**: 아랍어 방향 전환 = 접근성 + 국제화. 논리 CSS로 대응(Day 3·§3).
- 목표: Lighthouse 접근성 90+ 는 어렵지 않다. 시맨틱 + aria + 대비(contrast)면 대부분 해결.

---

## 6. 배포 & 테스트

**배포 (Vercel)**: Next.js는 Vercel에 푸시하면 자동 빌드·배포된다. env(`NEXT_PUBLIC_*`)는
대시보드에서 설정. 이 앱은 정적(SSG)이라 CDN 배포도 가능. **SW 버전 케이던스**: 배포마다
`package.json` 버전을 올려야 서비스워커 캐시가 갱신된다(Day 3·4).

**테스트 피라미드**:
- **단위(Vitest)**: `lib/game.ts`의 순수 함수 — `settle` 경계값, `orbitInfo` 위상, 액션 가드.
  순수라서 `expect(clamp(150)).toBe(100)`처럼 쉽다. (이 프로젝트가 테스트하기 좋은 이유 = §1.)
- **컴포넌트(React Testing Library)**: "버튼 클릭 시 게이지가 오른다" 같은 사용자 관점 검증.
- **E2E(Playwright)**: 실제 브라우저로 전 플로우 플레이 (이 저장소의 i18n 검증에 실제로 사용됨 —
  자동 언어 감지·설정 전환·아랍어 `dir=rtl` 확인).

---

## 7. 🏁 캡스톤 — 새 우주쓰레기 도감 항목 추가 (end-to-end)

**목표**: 새 쓰레기 1종("우주 정거장 파편" 등)을 게임·도감·10개 언어에 완전히 추가하며, **타입
시스템이 어떻게 누락을 강제하는지** 체험한다. 이게 되면 당신은 이 스택의 전 계층을 다룰 수 있다.

> 브랜치를 하나 파서 진행하라: `git checkout -b practice/new-debris`. 각 단계 후 `npm run build`를
> 돌려 **타입 에러가 다음 할 일을 알려주는** 흐름을 즐겨라.

**단계** (각 단계에서 빌드가 안내한다):

1. **타입 확장** — `src/lib/types.ts`의 `DebrisId` union에 `"station"`을 추가.
   → 즉시 여러 곳에서 타입 에러가 뜬다 (`Record<DebrisId, ...>`들이 새 키를 요구). **좋다. 그게 지도다.**
2. **초기 상태** — `src/lib/game.ts`의 `createInitialState`의 `debris` 리터럴에 `station: 0` 추가.
3. **도감 정의** — `src/lib/constants.ts`의 `DEBRIS_DEFS`에 새 항목(`id: "station"`, `icon`,
   `rarity`, `weight`, ...) 추가. 가중치를 정해 희귀도를 조절.
4. **SVG 아트** — `src/lib/debris.ts`의 `DEBRIS_SVG`(`Record<DebrisId, string>`)에 `station`의 SVG
   문자열 추가. (기존 항목을 복붙해 색만 바꿔도 됨.) `Record` 타입이 누락을 막는다.
5. **i18n 키 추가 (핵심 체험)** — `src/i18n/messages/ko.ts`의 `debris`에
   `station: { name: "정거장 파편", desc: "..." }` 추가. → **나머지 9개 언어 파일이 전부 타입
   에러!** `type Messages = typeof ko` 덕분이다. 각 `messages/{en,ar,zh,...}.ts`에 번역을 채워라.
   (여기서 §3.2의 안전망을 온몸으로 느낀다.)
6. **검증** — `npm run build` (타입 통과) + `npm run lint`. `npm run dev`로 도감(`DebrisPanel`)에
   새 항목이 뜨는지, 게임에서 수거되는지 확인. `DebrisPanel`은 `t(\`debris.${id}.name\`)`로
   조회하므로 **UI 코드는 안 고쳐도** 자동 반영된다 (계층 분리의 보상).

**성찰 질문** (캡스톤 후 스스로 답):
- 왜 union 타입 하나를 바꾸니 컴파일러가 "할 일 목록"을 만들어줬나?
- UI(`DebrisPanel`)를 안 고쳐도 새 항목이 뜬 이유는? (데이터 주도 렌더 + i18n 조회)
- 이 작업을 타입 없이 했다면 어떤 버그가 숨었을까? (번역 누락·초기화 누락 → 런타임 크래시)

> **대안 캡스톤** (더 쉬움/어려움): (쉬움) 설정에 새 토글 추가 — `usePwa`나 새 상태 + `SettingsPanel`
> + i18n 키. (어려움) 새 편지 템플릿 종류 추가 — `letters.ts` + `types.ts` + i18n `letter.*` 키.

---

## 8. 자가 체크리스트 (최종 — README 루브릭과 대조)

- [ ] 계층 아키텍처(lib/hooks/components)와 "순수 로직 분리 → 테스트 용이"를 설명한다
- [ ] 상태 라이브러리·React Query가 언제 필요한지 안다 (클라이언트 vs 서버 상태)
- [ ] i18n을 Context·`typeof` 타입안전 카탈로그·`Intl`·RTL로 처음부터 설명한다
- [ ] 번들·리렌더·First Load JS를 의식하고 Lighthouse/Profiler로 측정할 줄 안다
- [ ] 시맨틱 태그·`aria-*`·RTL로 접근성을 챙긴다
- [ ] **캡스톤을 완주**해 `lib → 데이터 → i18n → UI → 빌드` 전 계층 기능을 추가했다

---

## 9. 더 읽기 & 다음 여정

- [react.dev — Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [TanStack Query 문서](https://tanstack.com/query/latest) — **5일 이후 1순위** (서버 상태)
- [web.dev — Learn Accessibility](https://web.dev/learn/accessibility/)
- [MDN — Intl](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- 인덱스의 [5일 이후 로드맵](./README.md#6-5일-이후-로드맵-1티어-유지확장)으로 계속.

🎉 **완주 축하합니다.** 이제 이 저장소의 모든 계층을 읽고, 고치고, 확장할 수 있다. Python
백엔드의 견고함 + 프론트엔드의 선언적 사고 = 진짜 풀스택 1티어. 계속 손으로 만드세요.
