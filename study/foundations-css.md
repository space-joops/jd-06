# Foundations — CSS (우리 코드로 배우는 스타일링 기초)

← [인덱스로](./README.md) · 짝: [HTML 기초](./foundations-html.md) · [JS 기초](./foundations-js.md)

> **누구를 위한 문서인가**: "Tailwind 클래스(`flex`, `bg-mint`)는 붙여봤는데 그 아래 CSS가 뭔지
> 모르겠다" 하는 분. Day 3(Tailwind) 전에 읽으면 좋다. **우리 `globals.css`와 Tailwind 클래스**로
> CSS를 처음부터 짚고, **각 Tailwind 클래스가 어떤 raw CSS인지** 대응시킨다.
> **예상 소요**: 2.5~3시간 (개념 2h + 실습 1h)

---

## 0. 배경 지식 — CSS란 무엇인가

**CSS(Cascading Style Sheets)** 는 HTML 요소의 **겉모습**(색·크기·배치·애니메이션)을 지정한다.

기본 문법 — **선택자 + 선언 블록**:

```css
.space-bg {                                   /* 선택자: 이 클래스를 가진 요소에 */
  background: linear-gradient(180deg, ...);   /* 속성: 값; 선언 */
}
```

우리 코드는 CSS를 두 방식으로 쓴다:
1. **`globals.css`의 raw CSS** — 전역 스타일·디자인 토큰·`@keyframes` 애니메이션
2. **Tailwind 유틸리티 클래스** — `className="flex p-4 bg-mint"` (컴포넌트 안). **이것도 결국 CSS**다.

이 문서는 둘을 잇는다: Tailwind 클래스를 볼 때 "이게 무슨 CSS인지" 머릿속에서 번역할 수 있게.

### Cascading(캐스케이드)·상속·명시도

CSS의 이름에 있는 "Cascading" = **여러 규칙이 충돌하면 우선순위로 결정**한다는 뜻.

- **명시도(specificity)**: `id`(#) > `class`(.) > 태그. 더 구체적인 선택자가 이긴다.
- **상속(inheritance)**: `color`·`font-family` 같은 속성은 자식으로 물려받는다. 그래서 `body`에
  폰트를 한 번 정하면(`globals.css`) 전체가 그 폰트를 쓴다.
- **소스 순서**: 명시도가 같으면 나중에 온 규칙이 이긴다.

> Tailwind는 명시도 전쟁을 피하려 **거의 다 단일 클래스(낮고 균일한 명시도)** 로 만든다. 그래서
> "CSS 이름 짓기·명시도 지옥"이 줄어든다 — 백엔드 개발자에게 특히 편한 이유.

### 브라우저 렌더링 파이프라인 (배경)

CSS가 화면이 되기까지: **파싱 → 스타일 계산 → 레이아웃(위치·크기) → 페인트(픽셀) → 컴포짓(합성)**.
`transform`·`opacity`만 바꾸면 레이아웃·페인트를 건너뛰어(**컴포짓만**) 부드럽다 → 우리 애니메이션이
`transform`을 쓰는 이유 (§6).

---

## 1. 박스 모델 — 모든 요소는 상자다

모든 요소는 **content → padding → border → margin** 4겹 상자다.

```
┌─────────── margin (바깥 여백) ───────────┐
│  ┌──────── border (테두리) ────────┐     │
│  │   ┌──── padding (안 여백) ───┐   │     │
│  │   │      content (내용)     │   │     │
│  │   └─────────────────────────┘   │     │
│  └────────────────────────────────┘     │
└──────────────────────────────────────────┘
```

우리 코드의 Tailwind가 이걸 조절한다:

```tsx
<button className="px-4 py-3 rounded-xl border border-white/10 m-2">
```

| 클래스 | raw CSS | 뜻 |
|---|---|---|
| `px-4` | `padding-left/right: 1rem` | 좌우 안여백 (4×0.25rem) |
| `py-3` | `padding-top/bottom: 0.75rem` | 상하 안여백 |
| `m-2` | `margin: 0.5rem` | 바깥 여백 |
| `border` | `border-width: 1px` | 테두리 두께 |
| `rounded-xl` | `border-radius: 0.75rem` | 모서리 둥글게 |

> **간격 스케일**: Tailwind 숫자 × `0.25rem`(4px)이 기본. `p-4` = 16px, `gap-2` = 8px. 일관된
> 리듬을 준다 (디자인 시스템의 8pt grid).

---

## 2. 단위 — px, rem, %, vh/dvh

| 단위 | 뜻 | 우리 코드 |
|---|---|---|
| `px` | 절대 픽셀 | 테두리·미세 조정 |
| `rem` | 루트 폰트 크기 배수(보통 16px) | Tailwind 간격·글자 (`text-sm`=0.875rem) |
| `em` | 부모 폰트 크기 배수 | 상대 스케일 |
| `%` | 부모 대비 비율 | 게이지 너비 `width: ${pct}%` |
| `vh`/`vw`/`dvh` | 뷰포트 높이/너비 % | 전체화면 (`h-full`, 모바일 `100dvh`) |
| 임의값 `[430px]` | Tailwind 임의 단위 | `max-w-[430px]`(중앙 프레임) |

> `rem`을 쓰면 사용자가 브라우저 기본 글자 크기를 키웠을 때 전체가 함께 커진다(접근성). 그래서
> Tailwind가 `rem` 기반이다.

---

## 3. 색과 그라디언트

```css
/* globals.css */
:root { --background: #0b1026; }                 /* 16진수 색 */
.space-bg {
  background: linear-gradient(180deg, #0b1026 0%, #141239 55%, #241a4d 100%);  /* 세로 그라디언트 */
}
```

- **색 표기**: `#0b1026`(hex), `rgb(11,16,38)`, `rgba(255,255,255,0.1)`(알파=투명도).
- Tailwind의 `bg-white/10` = `background: rgb(255 255 255 / 0.1)` — **`/10`이 10% 불투명도**.
  우리 코드에 `bg-white/10`, `text-white/70` 처럼 반투명이 아주 많다 (다크 UI 레이어링).
- **그라디언트**: `linear-gradient`(선형), `radial-gradient`(방사 — SVG 지구 `earth-g`). 색 정지점(stop)으로 전이.

```tsx
// 인라인 그라디언트 유틸 (SharePanel 등)
<span className="bg-gradient-to-r from-[#ffd27a] to-[#ff8a80]" />
```

---

## 4. 레이아웃 — Flexbox (우리 앱의 주력)

**Flexbox**는 요소를 **한 축(가로 or 세로)** 으로 배치·정렬한다. 우리 화면 대부분이 flex다.

```tsx
// NameScreen — 세로 중앙 정렬 컬럼
<div className="flex h-full flex-col items-center px-6">
```

| 클래스 | raw CSS | 뜻 |
|---|---|---|
| `flex` | `display: flex` | flex 컨테이너 시작 |
| `flex-col` | `flex-direction: column` | 세로 방향(기본은 row=가로) |
| `items-center` | `align-items: center` | **교차축** 가운데 (col이면 가로 중앙) |
| `justify-center` | `justify-content: center` | **주축** 가운데 (col이면 세로 중앙) |
| `justify-between` | `justify-content: space-between` | 양끝 정렬 (OrbitScreen 헤더) |
| `gap-2` | `gap: 0.5rem` | 자식 사이 간격 |
| `flex-1` | `flex: 1 1 0%` | 남은 공간을 채움(늘어남) |
| `flex-wrap` | `flex-wrap: wrap` | 넘치면 줄바꿈 (이름 제안 버튼들) |

**주축(main) vs 교차축(cross)** 이 헷갈리는 핵심: `flex-row`면 주축=가로, `flex-col`이면 주축=세로.
`justify-*`는 주축, `items-*`는 교차축.

```tsx
// OrbitScreen 헤더 — 이름은 왼쪽, 총량은 오른쪽 (양끝)
<div className="flex items-center justify-between"> ... </div>
```

`<div className="flex-1" />` 같은 **빈 스페이서**로 아래 요소를 바닥에 밀어붙이는 트릭도 있다
(NameScreen의 CTA를 하단 고정).

> Grid(`display: grid`)는 2차원(행+열) 레이아웃용. 우리는 `LanguagePanel`의 2열 버튼 그리드에
> `grid grid-cols-2`를 쓴다. Flexbox=1축, Grid=2축이 대략의 구분.

---

## 5. 위치잡기 — position & z-index

```tsx
// InstallToast — 화면 상단에 겹쳐 띄우기
<div className="absolute inset-x-4 top-4 z-40"> ... </div>
// SpacewalkGame — 전체 화면 덮기
<div className="fixed inset-0 z-[60]"> ... </div>
```

| 클래스 | raw CSS | 뜻 |
|---|---|---|
| `relative` | `position: relative` | 기준점 설정(자식 absolute의 기준) |
| `absolute` | `position: absolute` | 가장 가까운 relative 조상 기준 배치 |
| `fixed` | `position: fixed` | 뷰포트(화면) 고정 |
| `inset-0` | `top/right/bottom/left: 0` | 사방 0 = 부모 꽉 채움 |
| `top-4`, `-right-8` | `top: 1rem`, `right: -2rem` | 개별 오프셋 (음수도) |
| `z-40`, `z-[60]` | `z-index: 40 / 60` | 겹침 순서(클수록 위) |

`NameScreen`의 말풍선 `<span className="absolute -right-8 top-2">`이 부모(`relative`) 기준으로
펫 오른쪽에 떠 있는 게 이 원리다.

---

## 6. transform · transition · animation (움직임)

### transform — 요소 변형 (레이아웃 영향 없음 = 빠름)

```css
transform: translateY(-7px);   /* 위로 이동 */
transform: scale(1.14, 0.88);  /* 가로 확대·세로 축소 (스퀴시) */
transform: rotate(7deg);       /* 회전 */
```

Tailwind: `active:scale-95` = "눌렸을 때(`:active`) 95%로 축소". 우리 버튼 거의 다 이걸 써서
누르면 살짝 들어가는 촉감을 준다.

### @keyframes — CSS 애니메이션 (우리 `globals.css`의 핵심)

```css
@keyframes bob {                    /* 이름 bob 애니메이션 정의 */
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-7px); }   /* 중간에 위로 */
}
.anim-bob {
  animation: bob 3s ease-in-out infinite;     /* 3초, 부드럽게, 무한 반복 */
}
```

- 키프레임 = "시점(%)별 상태"의 목록. 브라우저가 사이를 부드럽게 보간(interpolate).
- `animation: 이름 지속시간 이징 반복`. `infinite`=무한, `ease-in-out`=가감속.
- 컴포넌트에서 `<div className="anim-bob">` → 펫이 둥실둥실.
- 우리 `globals.css`엔 `bob`(둥실), `blink`(눈 깜빡), `twinkle`(별), `wobble`/`shake-hard`(흔들),
  `heart-rise`(하트 상승), `pop-in`(등장), `munch`(먹방), `rocket-rise`(발사) 등 ~16개가 있다.

### transition — 상태 변화의 부드러운 전이

```tsx
<button className="transition active:scale-95"> </button>
```

- `transition` = "속성이 바뀔 때 확 바뀌지 말고 부드럽게". 게이지 너비 변화(`transition-all
  duration-1000`)가 이걸로 애니메이션된다.
- **transition vs animation**: transition은 A→B **상태 전이**(트리거 필요), animation은
  `@keyframes`로 **자율 재생**(반복·복잡한 시퀀스).

> 성능 팁(§0): `transform`·`opacity`만 애니메이트하면 레이아웃·페인트를 건너뛰어 60fps가 쉽다.
> `width`·`top` 애니메이션은 무거우니 주의 (우리 게이지는 예외적으로 `width`를 씀 — 드물어서 OK).

---

## 7. CSS 커스텀 프로퍼티(변수) & Tailwind `@theme`

```css
:root {
  --background: #0b1026;    /* CSS 변수 정의 (전역) */
}
body { background: var(--background); }   /* var()로 사용 */
```

- **CSS 변수**는 런타임에 바뀔 수 있고 상속된다 (SCSS 변수와 다름). 테마·다크모드에 유용.
- 우리 `@theme` 블록(Tailwind v4)은 `--color-mint: #7de8c3` 같은 토큰을 정의하면
  **`bg-mint`/`text-mint` 유틸리티가 자동 생성**된다 (Day 3). 색을 한 곳(토큰)에서 관리 →
  브랜드 변경이 한 줄.

---

## 8. Tailwind ↔ raw CSS 디슈가링 표 (자주 보는 것)

우리 코드의 Tailwind를 CSS로 "번역"하는 감을 기르자:

| Tailwind | raw CSS |
|---|---|
| `flex` / `flex-col` | `display:flex` / `flex-direction:column` |
| `items-center justify-center` | `align-items:center; justify-content:center` |
| `gap-2` | `gap:0.5rem` |
| `p-4` / `px-4` / `py-3` | `padding:1rem` / 좌우 / 상하 |
| `m-2` / `mt-4` | `margin:0.5rem` / `margin-top:1rem` |
| `w-full` / `h-full` | `width:100%` / `height:100%` |
| `max-w-[430px]` | `max-width:430px` |
| `rounded-xl` / `rounded-full` | `border-radius:0.75rem` / `9999px` |
| `bg-mint` | `background-color: var(--color-mint)` |
| `text-white/70` | `color: rgb(255 255 255 / 0.7)` |
| `text-sm` / `font-bold` | `font-size:0.875rem` / `font-weight:700` |
| `absolute inset-0` | `position:absolute; top/right/bottom/left:0` |
| `z-40` | `z-index:40` |
| `active:scale-95` | `&:active { transform: scale(0.95) }` |
| `disabled:opacity-35` | `&:disabled { opacity:0.35 }` |
| `sm:border-x` | `@media(min-width:640px){ border-left/right-width:1px }` |
| `transition` | `transition-property:...; transition-duration:150ms` |

> **변형 접두사**: `hover:`, `active:`, `focus:`, `disabled:`는 **의사 클래스(pseudo-class)**,
> `sm:`/`md:`는 **미디어 쿼리**, `rtl:`은 방향. `focus:ring-2`(NameScreen 입력)= 포커스 시 링 표시.

---

## 9. 실습

> ⚠️ 확인 후 `git checkout .`.

### 실습 A — 개발자도구로 CSS 관찰 (30분)

1. `npm run dev` → F12 → 아무 버튼 클릭 → **Styles** 패널에서 Tailwind 클래스가 만든 실제 CSS
   규칙을 읽어라. `active:scale-95`가 `:active`에 어떻게 들어갔는지 확인(요소를 :active로 강제 토글 가능).
2. **Computed** 탭에서 박스 모델(padding/border/margin) 시각화를 보라.
3. `body`를 선택해 `font-family` 상속과 우리 다국어 폰트 스택을 확인.

### 실습 B — globals.css·Tailwind 만지기 (40분)

1. `globals.css`의 `--color-mint`를 `#ff9de2`로 바꿔 전 화면 민트 요소가 바뀌는지 보라 (토큰의 힘).
2. `@keyframes bob`의 `translateY(-7px)`를 `-30px`로 과장하고 펫이 크게 뛰는지 확인.
3. 아무 버튼의 `active:scale-95` → `active:scale-110`(커짐)·삭제(반응 없음)로 바꿔 촉감 차이를 느껴라.
4. `flex-col`을 `flex-row`로 바꿔 레이아웃이 가로로 무너지는 걸 보고, 주축/교차축을 체감.

### 실습 C — 새 애니메이션 만들기 (30분)

`globals.css`에 `@keyframes spin { to { transform: rotate(360deg) } }` + `.anim-spin { animation:
spin 2s linear infinite }`를 추가하고, 아무 이모지 `<span>`에 `className="anim-spin"`을 붙여
돌려보라. keyframes → 클래스 → 요소 적용의 전체 흐름 체험.

---

## 10. 연습문제

1. **(15분)** 박스 모델 4겹을 그리고, `px-4 py-3 m-2 border rounded-xl`이 각각 어디에 해당하는지 표시하라.
2. **(20분)** Flexbox에서 주축/교차축 개념을 설명하고, `flex-col items-center justify-between`이
   무엇을 하는지 우리 화면 예로 답하라.
3. **(20분)** 아래 Tailwind를 raw CSS로 번역하라:
   `className="absolute inset-x-4 top-4 z-40 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3"`
4. **(15분)** `transition`과 `@keyframes animation`의 차이, 그리고 `transform`으로 애니메이트하는 게
   왜 성능에 좋은지 설명하라.
5. **(15분)** CSS 변수(`--color-mint`)와 Tailwind `@theme` 토큰의 관계, "토큰 하나로 브랜드 변경"이
   가능한 이유를 설명하라.

---

## 11. 자가 체크리스트

- [ ] CSS 선택자·명시도·상속·캐스케이드를 이해한다
- [ ] 박스 모델(content/padding/border/margin)과 간격 스케일을 안다
- [ ] Flexbox의 주축/교차축과 `justify-*`/`items-*`를 우리 코드로 설명한다
- [ ] position(relative/absolute/fixed)·z-index로 겹치기를 이해한다
- [ ] `@keyframes`·transition·transform으로 움직임을 만들고, 성능 이유를 안다
- [ ] CSS 변수·`@theme` 토큰과, Tailwind 클래스↔raw CSS 대응을 읽는다

---

## 12. 더 읽기

- [MDN — CSS 첫걸음](https://developer.mozilla.org/ko/docs/Learn/CSS/First_steps)
- [MDN — Flexbox 가이드](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- [A Complete Guide to Flexbox (CSS-Tricks)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [web.dev — Learn CSS](https://web.dev/learn/css/)

다음 → [JS 기초](./foundations-js.md) · 이어서 [Day 3: Tailwind](./day-3-nextjs-tailwind.md)
