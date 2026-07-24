# Day 2 — React 19 ("UI = f(state)" 선언적 사고와 Hooks)

← [Day 1](./day-1-javascript-typescript.md) · [인덱스](./README.md) · 다음 → [Day 3](./day-3-nextjs-tailwind.md)

> **예상 소요**: 3.5~4시간 (핵심 2.5h + 실습·연습 1.5h)
> **교보재 파일**: `src/components/Game.tsx`, `src/hooks/useGame.ts`, `src/hooks/usePwa.ts`,
> `src/hooks/usePetReaction.ts`, `src/components/Hearts.tsx`, `src/components/screens/RaisingScreen.tsx`,
> `src/components/screens/OrbitScreen.tsx`
> **선행 권장**: [HTML 기초](./foundations-html.md) — JSX가 만드는 HTML·시맨틱·폼·접근성을 먼저 잡으면 React가 쉬워진다.

---

## 학습 목표

- React의 **선언적 렌더링**("상태를 그리면 UI가 따라온다")을 체화한다
- JSX·컴포넌트·props·합성을 읽고 쓴다
- 핵심 Hooks(`useState`·`useEffect`·`useRef`·`useCallback`·`useMemo`·`useContext`)를 언제·왜 쓰는지 안다
- **커스텀 훅**으로 로직을 재사용하는 법을 이 프로젝트의 `useGame`/`usePwa`/`usePetReaction`으로 배운다
- 리렌더(re-render)·재조정(reconciliation)·`key`를 이해한다

---

## 1. 멘탈 모델 브릿지 — 선언형이라는 낯섦

백엔드/스크립트는 **명령형**이다: "이 버튼을 만들고, 클릭되면 이 텍스트를 바꿔라."
React는 **선언형**이다: "상태가 이러면 화면은 이렇게 생겼다"만 기술하고, 상태가 바뀌면
React가 **알아서 화면을 다시 계산**한다.

> 데이터 엔지니어 비유: pandas에서 원본을 in-place로 바꾸기보다 **변환을 적용해 새 DataFrame을
> 만들고 그걸 표시**하는 것과 같다. React 컴포넌트는 `render(state) -> UI`라는 **순수 변환**이고,
> 상태가 바뀔 때마다 이 변환을 다시 돌린다. `UI = f(state)`.

핵심 규칙 3가지:

1. **DOM을 직접 만지지 마라.** `document.getElementById(...).textContent = ...` 하고 싶은 본능을
   참아라. 대신 **상태(state)를 바꿔라.** 그럼 UI가 따라온다.
2. **상태는 불변으로 갱신하라.** 배열/객체를 직접 수정하지 말고 **새 것**을 만들어 `setState`에
   넘겨라 (Day 1의 스프레드 `...`). React는 "참조가 바뀌었나?"로 변경을 감지한다.
3. **렌더 함수는 순수해야 한다.** 렌더 도중 부수효과(네트워크·타이머·localStorage)를 내지 마라 —
   그건 `useEffect`의 일이다.

---

## 2. 컴포넌트와 JSX

컴포넌트는 **JSX(UI)를 반환하는 함수**다. `src/components/Game.tsx`의 축약:

```tsx
function Splash() {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <span className="anim-twinkle text-4xl">✨</span>
      <h1 className="text-xl font-bold">{t("splash.title")}</h1>
    </div>
  );
}
```

- 함수 이름은 **대문자로 시작**해야 컴포넌트로 인식된다 (`Splash`, `Game`)
- `className` (HTML의 `class`가 아니라 — `class`는 JS 예약어라서)
- `{ }` 안에는 **JS 표현식**이 들어간다: `{t("splash.title")}`, `{count + 1}`
- 반드시 **하나의 루트 요소**를 반환 (여러 개면 `<>...</>` fragment로 감쌈)

### props — 컴포넌트의 인자

Python 함수 인자처럼, 부모가 자식에게 데이터를 내려준다:

```tsx
// 정의 (구조 분해로 받음)
function Gauge({ label, value, color }: { label: string; value: number; color: string }) {
  return <div>{label}: {Math.round(value)}</div>;
}
// 사용
<Gauge label={t("gauge.mood")} value={mood} color={moodColor(mood)} />
```

### 합성(composition) — 스테이지 머신

`Game.tsx`는 상태(`stage`)에 따라 어떤 화면을 그릴지 `switch`로 고른다. **명령형으로 화면을
전환**하는 게 아니라, **상태를 선언하면 맞는 컴포넌트가 렌더**된다:

```tsx
function Screens({ api, pwa }: { api: GameApi; pwa: PwaApi }) {
  switch (api.state.stage) {
    case "adopt":     return <AdoptScreen api={api} />;
    case "egg":       return <EggScreen api={api} />;
    case "raising":   return <RaisingScreen api={api} />;
    case "orbit":     return <OrbitScreen api={api} pwa={pwa} />;
    // ...
  }
}
```

`api.doSnack()` 같은 액션이 `stage`를 바꾸면, 다음 렌더에서 자동으로 다른 화면이 나온다.

---

## 3. Hooks — 함수 컴포넌트에 기억과 부수효과를 준다

컴포넌트 함수는 렌더될 때마다 **처음부터 다시 실행**된다. 그럼 변수는 매번 초기화될 텐데,
어떻게 "상태"를 기억할까? → **Hooks**. 이름이 `use`로 시작하는 특별한 함수들이다.

> **Hooks 규칙**: ① 컴포넌트/커스텀 훅의 **최상단**에서만 호출 (조건문·반복문 안 X)
> ② 이름이 `use~`인 함수 안에서만. 이유: React는 훅 호출 **순서**로 상태를 식별한다.

### 3.1 `useState` — 렌더 간 유지되는 상태

`OrbitScreen.tsx`:

```tsx
const [panel, setPanel] = useState<PanelKind>(null);   // 열린 패널
const [toast, setToast] = useState<string | null>(null);
// ...
setPanel("settings");  // 상태를 바꾸면 → 리렌더 → 설정 패널이 그려짐
```

- `[값, 설정함수]` 배열 구조 분해 (관례: `x, setX`)
- `setPanel(...)`을 부르면 React가 **리렌더를 예약**한다 (즉시 바뀌지 않음)
- **상태를 불변으로 갱신**: 배열이면 `setItems([...items, newItem])`, 객체면 `setObj({ ...obj, k: v })`

### 3.2 `useEffect` — 렌더 "이후"에 부수효과

렌더는 순수해야 하므로, 네트워크·타이머·구독 같은 **부수효과**는 `useEffect`에 넣는다.
`src/hooks/useGame.ts`의 1초 틱(게임 심장):

```tsx
useEffect(() => {
  const id = setInterval(() => {
    setNow(Date.now());          // 1초마다 현재 시각 갱신 → 리렌더
  }, 1000);
  return () => clearInterval(id); // 클린업: 언마운트/재실행 전에 타이머 정리
}, []);                           // 의존성 배열
```

**의존성 배열이 전부다:**

| 배열 | 언제 실행 | Python 비유 |
|---|---|---|
| `[]` | 마운트 시 1회 (+ 언마운트 시 클린업) | `__init__` / `__del__` |
| `[a, b]` | `a` 또는 `b`가 바뀔 때마다 | 값이 바뀌면 재구독 |
| (생략) | **매 렌더마다** | 거의 안 씀 (주의) |

- **클린업 함수**(return): 다음 실행 전 또는 컴포넌트가 사라질 때 호출. 타이머·이벤트 리스너·
  구독을 여기서 해제 (누수 방지). `useGame`은 `clearInterval`, `usePwa`는 이벤트 리스너 제거.
- ⚠️ **stale closure(오래된 클로저) 함정**: 이펙트 안 콜백이 옛 상태를 붙잡는 문제. `useGame`은
  `stateRef.current`(다음 절)로 항상 최신 상태를 읽어 이를 피한다.

`usePwa.ts`의 이벤트 구독 예:

```tsx
useEffect(() => {
  const onPrompt = (e: Event) => { /* beforeinstallprompt 캡처 */ };
  window.addEventListener("beforeinstallprompt", onPrompt);
  return () => window.removeEventListener("beforeinstallprompt", onPrompt); // 반드시 짝 해제
}, []);
```

### 3.3 `useRef` — 리렌더를 유발하지 않는 상자 / DOM 참조

`useRef`는 두 용도다:

**(a) 값 보관(리렌더 X)** — `useGame`의 최신 상태 미러:

```tsx
const stateRef = useRef(state);
stateRef.current = state;   // 매 렌더 최신화. 타이머 콜백은 stateRef.current로 최신값을 읽음
```

`Hearts.tsx`의 `useHearts`는 하트 id 카운터를 ref로 둔다 (증가해도 리렌더 불필요):

```tsx
const idRef = useRef(0);
const spawn = (x, y, emoji = "💗") => {
  const id = idRef.current++;      // 리렌더 없이 증가
  setHearts((h) => [...h, { id, x, y, emoji }]);  // 이건 상태라 리렌더
  setTimeout(() => setHearts((h) => h.filter((it) => it.id !== id)), 1200);
};
```

**(b) DOM 요소 참조** — `usePetReaction.ts`가 실제 DOM 노드를 잡아 애니메이션한다:

```tsx
const ref = useRef<HTMLDivElement>(null);
const react = () => {
  ref.current?.animate(                        // Web Animations API (Day 4)
    [{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }],
    { duration: 320, easing: "ease-out" }
  );
  navigator.vibrate?.(12);                      // 진동 (지원 시)
};
// 컴포넌트에서: <div ref={ref}> ... </div>
```

여기가 **"DOM 직접 조작이 정당한" 예외**다: 탭마다 1회성 애니메이션을 리렌더 없이 재생하려면
명령형이 맞다. 하지만 이런 경우는 드물고, 대부분은 상태로 처리한다.

### 3.4 `useCallback` / `useMemo` — 참조 안정화(성능)

렌더마다 함수·객체가 새로 만들어지면, 그걸 받는 자식이 불필요하게 리렌더될 수 있다.
`useCallback(fn, deps)`은 **함수를**, `useMemo(() => value, deps)`은 **값을** deps가 그대로면
재사용한다.

- `useGame.ts`의 `commit = useCallback(...)` — 액션 함수의 참조를 안정화
- `I18nProvider.tsx`의 `t`·`formatNumber`는 `useMemo`로 만들어, locale이 바뀔 때만 재생성

> ⚠️ **성급한 최적화 주의**: 모든 걸 감싸지 마라. "이 함수/값이 자식의 `memo`나 다른 훅의 deps로
> 쓰이는가?"가 기준이다. 아니면 그냥 두는 게 낫다.

### 3.5 `useContext` — prop drilling 없이 전역값 공유 (Day 5 예습)

`I18nProvider.tsx`는 언어·`t()`를 Context로 제공하고, 어느 깊이의 컴포넌트든 `useI18n()`으로
꺼내 쓴다. Day 5에서 자세히.

```tsx
const { t, locale, setLocale } = useI18n();   // 어떤 컴포넌트에서든
```

---

## 4. 커스텀 훅 — 로직 재사용의 정석

컴포넌트에서 **UI가 아닌 로직**(상태 + 이펙트)을 떼어 `use~` 함수로 만들면 재사용된다.
이 프로젝트의 커스텀 훅 5개:

| 훅 | 파일 | 책임 |
|---|---|---|
| `useGame` | `hooks/useGame.ts` | 게임 상태·1초 틱·오프라인 정산·자동 저장·액션 API |
| `usePwa` | `hooks/usePwa.ts` | 서비스워커 등록/업데이트·설치 프롬프트·알림 권한 |
| `usePetReaction` | `hooks/usePetReaction.ts` | 쓰다듬기 스퀴시 애니(WAAPI) + 진동 |
| `useHearts` | `components/Hearts.tsx` | 탭 하트 파티클 스폰·자동 소멸 |
| `useI18n` | `i18n/I18nProvider.tsx` | 현재 언어·`t()`·숫자/날짜 포맷 |

`useGame`의 설계가 특히 배울 만하다 — **순수 로직(`lib/game.ts`)과 React를 잇는 얇은 층**이다:

```tsx
export function useGame(): GameApi | null {
  const [state, setState] = useState<GameState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const stateRef = useRef(state);
  stateRef.current = state;

  // 마운트: 저장 로드 + 오프라인 정산
  useEffect(() => { /* loadGame() → settle() → setState */ }, []);
  // 1초 틱 + 탭 복귀 재정산
  useEffect(() => { /* setInterval + visibilitychange */ }, []);
  // 상태 바뀔 때마다 자동 저장
  useEffect(() => { if (state) saveGame(state); }, [state]);

  // 순수 리듀서를 감싸 UI에 성공 여부를 돌려주는 헬퍼
  const run = (fn: (s: GameState, t: number) => GameState): boolean => {
    const cur = stateRef.current; if (!cur) return false;
    const settled = settle(cur, Date.now()).state;
    const next = fn(settled, Date.now());
    setState(next);
    return next !== settled;   // 참조가 바뀌었으면 "성공" (Day 1의 불변 규약 덕분!)
  };
  // ...
}
```

여기서 Day 1의 **불변 업데이트**가 빛난다: 액션이 조건을 못 맞추면 `game.ts`가 원본을 그대로
반환 → `next === settled` → "실패"로 판정 → UI가 하트를 안 띄운다. 상태 관리와 순수 함수가
깔끔히 분리된 **1티어 설계**다.

> `useGame`이 `GameApi | null`을 반환하는 이유: 서버/첫 렌더에는 localStorage를 못 읽어 `null`,
> 마운트 후 로드되면 실제 API. `Game.tsx`가 `api ? <Screens/> : <Splash/>`로 분기한다.

---

## 5. 리렌더 · 재조정 · key

- **리렌더(re-render)**: 상태/props가 바뀌면 컴포넌트 함수가 **다시 실행**되어 새 JSX를 만든다.
  React는 이전 결과와 **비교(reconciliation, 재조정)** 해 **바뀐 DOM만** 최소로 갱신한다.
  (전체를 새로 그리지 않는다 — 그래서 빠르다.)
- **리렌더 ≠ 리마운트**: 리렌더는 상태 유지, 리마운트는 상태 초기화(컴포넌트가 새로 태어남).
- **`key`**: 리스트를 그릴 때 각 항목의 정체성. `key`가 같으면 "같은 항목(리렌더)", 다르면
  "다른 항목(리마운트)". `LettersPanel`이 편지 리스트를 `key={letter.id}`로 그린다:

```tsx
{letters.map((l) => <LetterRow key={l.id} letter={l} />)}
```

- **`key`로 애니메이션 재시작 트릭**: `EggSvg.tsx`는 탭할 때마다 `key={wobbleKey}`를 바꿔
  요소를 **리마운트**시켜 CSS 흔들림을 처음부터 재생한다. (영리한 선언형 패턴)

> ⚠️ **리스트 `key`에 배열 인덱스를 쓰지 마라** (항목이 재정렬/삭제되면 상태가 엉킨다). 안정적인
> 고유 id를 써라 — `Letter.id`처럼.

---

## 6. `"use client"` — 서버/클라이언트 경계 (Day 3 예습)

Next.js 15에서 컴포넌트는 기본적으로 **Server Component**(서버에서만 실행)다. `useState`·
`useEffect`·이벤트 핸들러·브라우저 API를 쓰려면 파일 맨 위에 `"use client"`가 필요하다.
이 프로젝트는 게임이라 인터랙션이 많아 대부분 `"use client"`다 (`Game.tsx`, 모든 `screens/*`,
`hooks/*`). 순수 렌더인 `PetSvg`·`OrbitView`·`Gauge`는 지시어가 없어도 된다. 자세한 트레이드오프는 Day 3.

---

## 7. 실습

### 실습 A — 상태 흐름 추적 (40분)

1. `src/components/screens/RaisingScreen.tsx`를 열어라. 펫을 탭하면(`onPointerDown`) →
   `api.doPet()`(또는 유사) 호출 → `useGame`의 `run()` → `petThePet()`(game.ts) → 새 상태 →
   리렌더 → 게이지가 오르는 흐름을 **한 줄씩** 따라가라.
2. `useHearts`의 `spawn`이 어디서 불리고, 하트가 어떻게 1.2초 뒤 사라지는지 추적하라.
3. `OrbitScreen.tsx`의 `panel` 상태가 바뀌면 어떤 패널이 렌더되는지 `switch`/조건부 렌더를 확인하라.

### 실습 B — 작은 컴포넌트 만들기 (40분)

> ⚠️ 확인 후 되돌려라(`git checkout .`).

1. `RaisingScreen`에 탭 횟수를 세는 `const [taps, setTaps] = useState(0)`를 추가하고,
   `onPointerDown`에서 `setTaps((n) => n + 1)`, 화면에 `<p>탭: {taps}</p>`를 렌더하라.
   저장 → HMR로 즉시 확인. **상태→UI 흐름을 손으로** 체험.
2. 위에서 `setTaps(taps + 1)` 대신 `setTaps((n) => n + 1)`(함수형 업데이트)을 쓴 이유를 생각하라
   (빠른 연속 탭 시 stale 값 방지).

---

## 8. 연습문제

1. **(20분)** `useEffect`의 의존성 배열이 `[]`, `[x]`, 생략일 때 각각 언제 실행되는지, 클린업이
   언제 도는지 말로 설명하라. `useGame`의 세 이펙트가 각각 왜 그 배열을 쓰는지 답하라.
2. **(20분)** "리렌더"와 "리마운트"의 차이를 예로 설명하고, `EggSvg`가 `key`로 애니메이션을
   재시작하는 원리를 설명하라.
3. **(30분)** `usePetReaction`을 참고해, 탭하면 요소가 좌우로 흔들리는 커스텀 훅 `useShake()`
   (`{ ref, shake }`)를 종이에 설계하라. WAAPI `animate` keyframes를 채워보라.

---

## 9. 자가 체크리스트

- [ ] "UI = f(state)" 선언적 모델을 설명하고, DOM 직접 조작 대신 상태를 바꾼다
- [ ] `useState`로 상태를 불변 갱신한다
- [ ] `useEffect`의 의존성 배열·클린업·stale closure를 이해한다
- [ ] `useRef`의 두 용도(값 보관 / DOM 참조)를 구분한다
- [ ] 커스텀 훅으로 로직을 재사용할 수 있고, `useGame`의 순수로직↔React 분리를 설명한다
- [ ] 리렌더·재조정·`key`의 역할을 안다

---

## 10. 더 읽기

- [React 공식 문서 — Learn](https://react.dev/learn) (특히 "Thinking in React", "Synchronizing with Effects")
- [react.dev — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) (필독)
- [react.dev — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

다음 → [Day 3: Next.js 15 & Tailwind CSS](./day-3-nextjs-tailwind.md)
