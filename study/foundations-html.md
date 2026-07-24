# Foundations — HTML (우리 코드로 배우는 마크업 기초)

← [인덱스로](./README.md) · 짝: [CSS 기초](./foundations-css.md) · [JS 기초](./foundations-js.md)

> **누구를 위한 문서인가**: "React·JSX는 봤는데 그 아래 HTML이 뭔지 모르겠다" 하는 분.
> Day 2(React) 전에 읽으면 좋다. **우리 저장소의 실제 마크업**으로 HTML을 처음부터 짚는다.
> **예상 소요**: 2~2.5시간 (개념 1.5h + 실습 1h)

---

## 0. 배경 지식 — HTML이란 무엇인가

**HTML(HyperText Markup Language)** 은 웹페이지의 **구조와 의미**를 기술하는 마크업 언어다.
프로그래밍 언어가 아니라 **문서 서식 언어**다 (Markdown의 강력한 조상).

- 브라우저는 HTML 텍스트를 파싱해 **DOM 트리**(문서 객체 모델, Day 4)를 만든다.
- 각 **요소(element)** 는 여는 태그·내용·닫는 태그로 구성: `<h1>제목</h1>`
- 역할 분담(세 언어의 관심사 분리):
  - **HTML** = 구조·의미 ("이건 제목, 이건 버튼")
  - **CSS** = 겉모습 ("제목은 크고 민트색")
  - **JS** = 동작 ("버튼을 누르면 이렇게")

> Python 비유: HTML은 데이터의 **스키마/구조**, CSS는 **표현(렌더)**, JS는 **로직**. 잘 나눌수록
> 유지보수가 쉽다 — 백엔드의 관심사 분리와 같다.

### JSX ↔ HTML 관계 (우리 코드의 정체)

우리는 HTML을 손으로 쓰지 않고 **JSX**로 쓴다. JSX는 "JS 안에서 HTML처럼 생긴 문법"이고,
빌드 시 실제 HTML(DOM)로 바뀐다. **거의 똑같지만 몇 가지 규칙이 다르다:**

| HTML | JSX (우리 코드) | 이유 |
|---|---|---|
| `class="..."` | `className="..."` | `class`는 JS 예약어 |
| `for="..."` (label) | `htmlFor="..."` | `for`도 예약어 |
| `onclick="..."` | `onClick={...}` | camelCase + JS 함수 |
| `<br>` (안 닫음) | `<br />` (셀프클로징) | JSX는 XML 규칙 |
| `style="color:red"` | `style={{ color: "red" }}` | 객체로 |
| `tabindex`, `maxlength` | `tabIndex`, `maxLength` | camelCase |

즉 **JSX를 읽으면 HTML을 읽는 것**이다. 이 문서의 예제는 전부 우리 JSX이고, 브라우저 개발자도구
(F12) → Elements 탭에서 그게 어떤 실제 HTML로 렌더됐는지 확인할 수 있다.

---

## 1. 문서의 뼈대 (`src/app/layout.tsx`)

모든 페이지는 이 골격 안에 들어간다:

```tsx
<html lang="en" dir="ltr">
  <body className="...">
    {children}   {/* 여기에 게임 전체가 렌더된다 */}
  </body>
</html>
```

- `<html>` — 문서의 루트. `lang`(언어)·`dir`(글 방향, ltr/rtl)은 **접근성·SEO·i18n**에 중요.
  우리 i18n(Day 5)이 런타임에 이 둘을 바꿔 아랍어면 `dir="rtl"`로 만든다.
- `<head>`(Next가 metadata로 생성) — 화면에 안 보이는 메타정보(제목·아이콘·OG).
- `<body>` — 실제 보이는 내용 전부.

> HTML 문서는 딱 하나의 `<html>`, 그 안에 `<head>`(정보)와 `<body>`(내용). 이게 만국 공통 뼈대다.

---

## 2. 요소(element)와 속성(attribute) 해부

```tsx
<button onClick={onSnack} disabled={snackUsed} className="rounded-xl bg-white/10 py-3">
  {t("orbit.snackGive")}
</button>
```

- **태그 이름**: `button` — 요소의 종류
- **속성(attribute)**: `onClick`, `disabled`, `className` — 요소의 설정. `이름={값}` 형태.
  - `disabled={snackUsed}` — boolean 속성. `true`면 버튼이 비활성(회색·클릭 불가).
- **내용(children)**: `{t("orbit.snackGive")}` — 태그 사이의 자식. 텍스트·다른 요소.

속성은 요소 종류마다 의미 있는 게 다르다. 우리 코드에 자주 나오는 속성:

| 속성 | 어디에 | 뜻 |
|---|---|---|
| `href` | `<a>` | 링크 목적지 |
| `src`, `alt` | `<img>` | 이미지 경로, 대체 텍스트(접근성) |
| `type`, `value`, `placeholder`, `maxLength` | `<input>` | 입력 종류·값·힌트·최대길이 |
| `disabled` | `<button>` | 비활성화 |
| `aria-label`, `aria-pressed`, `aria-hidden`, `role` | 여러 곳 | 접근성 |
| `lang`, `dir` | `<html>` | 언어·글 방향 |
| `key` | 리스트 항목 | (React 전용) 정체성 |

---

## 3. 우리가 쓰는 요소들 (종류별)

### 3.1 구조/레이아웃 요소

박스를 나누고 묶는다. **의미 있는 이름을 쓰는 게 시맨틱 HTML**이다.

```tsx
// OrbitScreen.tsx — 시맨틱 구조의 좋은 예
<header className="px-5 pt-5"> ... </header>       {/* 화면 상단 머리말 */}
<section className="relative flex flex-1 ...">...</section>  {/* 주요 콘텐츠 영역 */}
<nav className="flex justify-around ...">          {/* 하단 내비게이션 */}
  <NavButton icon="💌" label={t("nav.letters")} />
</nav>
```

- `<div>` — 의미 없는 만능 상자 (레이아웃용). 가장 흔함.
- `<span>` — 의미 없는 인라인 상자 (텍스트 일부 감쌀 때).
- `<header>` / `<nav>` / `<main>` / `<section>` / `<footer>` — **의미 있는** 구획. 스크린리더·
  검색엔진이 "여긴 내비, 여긴 본문"을 이해한다. `Game.tsx`는 `<main>`으로 앱을 감싼다.

> **왜 시맨틱?** `<div onClick>` 대신 `<button>`, 만능 `<div>` 대신 `<nav>`를 쓰면 접근성·SEO·
> 가독성이 공짜로 좋아진다. 1티어의 기본 습관.

### 3.2 텍스트 요소

```tsx
<h1 className="mt-4 text-xl font-bold">{t("name.title")}</h1>   {/* 제목 (h1~h6) */}
<p className="mt-3 text-xs text-white/45">{t("orbit.nextReunion")}</p>  {/* 문단 */}
<span className="text-lg font-bold">{state.pet.name}</span>    {/* 인라인 텍스트 */}
```

- `<h1>`~`<h6>` — 제목 계층. 페이지에 `<h1>`은 보통 하나 (문서 개요).
- `<p>` — 문단(paragraph). `<span>` — 흐름 속 텍스트 조각.

### 3.3 상호작용 요소 — 버튼과 입력

**버튼** (우리 앱에서 가장 많이 쓰는 상호작용):

```tsx
<button onClick={() => api.nameAndStart(finalName)} className="w-full rounded-2xl bg-mint py-4">
  {t("name.cta", { name: finalName })}
</button>
```

**입력(input)** — 사용자가 텍스트를 친다. `NameScreen.tsx`의 펫 이름 입력:

```tsx
<input
  value={name}                              {/* 현재 값 (state와 묶임) */}
  onChange={(e) => setName(e.target.value)} {/* 칠 때마다 state 갱신 */}
  maxLength={12}                            {/* 최대 12자 */}
  placeholder={defaultName}                 {/* 비었을 때 회색 힌트 */}
  className="... focus:ring-2"
/>
```

이게 **controlled input(제어 컴포넌트)** 이다: 입력값의 "진실의 원천(source of truth)"이 DOM이
아니라 **React state(`name`)**. `onChange`로 state를 갱신 → 리렌더 → `value`가 반영. HTML 폼과
React가 만나는 핵심 지점 (Day 2의 상태 개념과 연결).

- `<input type="text|number|checkbox|...">` — `type`으로 종류가 바뀐다. (우리는 텍스트만 씀)
- 실무의 폼: `<form>`, `<label>`, `<textarea>`, `<select>` 도 있다 (이 앱엔 최소).

### 3.4 미디어 요소 — 이미지와 SVG

```tsx
// 도감(DebrisPanel): data URL 이미지
<img src={DEBRIS_DATAURL[d.id]} alt="" className="h-10 w-10" />

// 인라인 SVG (PetSvg/OrbitView) — HTML 안의 벡터 그래픽
<svg viewBox="0 0 360 240" aria-hidden>
  <circle cx={180} cy={330} r={150} fill="url(#earth-g)" />
</svg>
```

- `<img>` — 외부/데이터 이미지. `alt`는 **대체 텍스트**(이미지 못 볼 때·스크린리더). 장식이면 `alt=""`.
- `<svg>` — HTML 문서 안에 들어가는 **벡터 그래픽 마크업**(별도 네임스페이스). `<circle>`,
  `<path>`, `<rect>`, `<g>`(그룹) 같은 자식으로 도형을 그린다. Day 4에서 자세히.

---

## 4. 접근성(a11y) 속성 — 공짜 품질

화면만 보는 사람 외에 **스크린리더·키보드 사용자**를 위한 속성. 우리 코드 예:

```tsx
<button aria-label={t("installToast.ariaDismiss")}>×</button>   {/* 아이콘만 있는 버튼의 이름 */}
<button aria-pressed={active}>{l.name}</button>                  {/* 토글의 눌림 상태 (LanguagePanel) */}
<svg aria-hidden> ... </svg>                                     {/* 장식용 — 읽지 마라 */}
<img alt="" />                                                   {/* 장식 이미지 */}
```

- `aria-label` — 보이는 텍스트가 없는 요소(아이콘 버튼)에 **이름**을 준다.
- `aria-pressed` / `aria-selected` — 토글·선택 **상태**.
- `aria-hidden` / `alt=""` — 순수 장식이라 보조기기가 **무시**하게.
- 원칙: **가능하면 시맨틱 태그로 해결**(`<button>`은 자동으로 키보드·포커스 지원), aria는 보강.

---

## 5. 실습

> ⚠️ 실습용. 확인 후 되돌려라(`git checkout .`).

### 실습 A — 렌더된 HTML 관찰 (30분)

1. `npm run dev` 후 브라우저에서 게임을 열고 **F12 → Elements** 탭을 펴라.
2. 우리 JSX(`OrbitScreen`)가 실제로 어떤 `<header>`/`<section>`/`<nav>`/`<button>` HTML로
   렌더됐는지 대조하라. `className`이 실제 `class`로 바뀐 것도 확인.
3. 아무 요소를 클릭 → 오른쪽 **Styles** 패널에서 어떤 CSS가 적용됐는지 미리 구경(→ [CSS 기초](./foundations-css.md)).

### 실습 B — 마크업 수정 (30분)

1. `NameScreen.tsx`의 `<h1>`을 `<h2>`로 바꿔보고 화면·개발자도구에서 차이를 보라 (의미·기본 크기).
2. 입력창의 `maxLength={12}`를 `4`로 바꾸고 이름을 길게 쳐보라 — HTML 속성이 입력을 막는 걸 확인.
3. 이름 제안 버튼(`suggestions.map`)에 `aria-label`을 추가해보고, 왜 텍스트가 이미 있으면
   `aria-label`이 대개 불필요한지 생각하라.

### 실습 C — 시맨틱 리팩터 연습 (20분)

`Game.tsx`나 아무 화면에서 순수 `<div>`로 된 클릭 요소를 찾아, 만약 그게 버튼 역할이라면
`<button>`으로 바꿨을 때의 장점(키보드 포커스·엔터 실행·스크린리더)을 적어보라.

---

## 6. 연습문제

1. **(15분)** JSX와 HTML의 차이 5가지(`className`, `htmlFor`, camelCase 이벤트, 셀프클로징,
   `style` 객체)를 예와 함께 설명하라.
2. **(15분)** "시맨틱 HTML"이 무엇이고 `<div onClick>` 대신 `<button>`을 쓰면 좋은 이유 3가지를 대라.
3. **(20분)** controlled input(`NameScreen`)에서 `value`·`onChange`·state가 어떻게 한 사이클을
   이루는지 그림으로 그려라. `value`만 있고 `onChange`가 없으면 왜 입력이 안 되는지 설명하라.
4. **(15분)** 우리 앱에 검색창을 넣는다면 어떤 요소·속성(`<input type>`, `<label>`, `aria-*`)을
   쓸지 마크업을 스케치하라.

---

## 7. 자가 체크리스트

- [ ] HTML의 역할(구조/의미)과 CSS·JS와의 분업을 설명한다
- [ ] JSX가 HTML로 바뀌는 규칙(`className` 등)을 안다
- [ ] `<html><head><body>` 문서 뼈대와 `lang`/`dir`의 의미를 안다
- [ ] 요소·속성·내용을 구분하고, 우리 코드의 주요 요소(div/span/button/input/img/svg/header/nav)를 읽는다
- [ ] 시맨틱 HTML과 접근성 속성(`aria-label`/`aria-pressed`/`alt`)의 가치를 안다
- [ ] controlled input의 value·onChange·state 사이클을 설명한다

---

## 8. 더 읽기

- [MDN — HTML 기본 개념](https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML)
- [MDN — HTML 요소 레퍼런스](https://developer.mozilla.org/ko/docs/Web/HTML/Element)
- [MDN — ARIA 기초](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA)
- [web.dev — Learn HTML](https://web.dev/learn/html/)

다음 → [CSS 기초](./foundations-css.md) · 이어서 [Day 2: React](./day-2-react.md)
