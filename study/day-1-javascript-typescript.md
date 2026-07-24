# Day 1 — JavaScript & TypeScript (Python 개발자를 위한 언어 장착)

← [인덱스로](./README.md) · 다음 → [Day 2: React](./day-2-react.md)

> **예상 소요**: 3~4시간 (핵심 개념 2h + 실습·연습 1.5h)
> **교보재 파일**: `src/lib/game.ts`, `src/lib/types.ts`, `src/lib/constants.ts`, `tsconfig.json`, `package.json`
> **짝 문서**: [JS 기초(심화)](./foundations-js.md) — 스코프·클로저·`this`·이벤트·에러처리를 배경부터 더 깊게.

---

## 학습 목표

오늘이 끝나면:

- JavaScript(JS)의 핵심 문법을 Python과 대조해 읽고 쓸 수 있다
- `Promise`/`async`·`await`와 이벤트 루프를 asyncio 지식으로 이해한다
- TypeScript(TS)의 타입 시스템(union, interface, generic, `typeof`, discriminated union)을 실전 코드에서 읽는다
- npm·`package.json`·`tsconfig.json`·ESLint가 각각 pip·requirements·mypy·ruff의 무엇에 해당하는지 안다

이 프로젝트에서 **가장 Python다운 곳**이 `src/lib/`다. React도 브라우저도 없는 **순수 함수와
타입**만 있다. 그래서 첫날은 여기서 논다.

---

## 1. Python 개발자를 위한 멘탈 모델 브릿지

| Python | JavaScript / TypeScript | 메모 |
|---|---|---|
| `snake_case`, 들여쓰기 블록 | `camelCase`, `{ }` 중괄호 블록, 세미콜론(선택) | 관례가 다름 |
| `None` | `null` **그리고** `undefined` (둘!) | undefined = "값이 아직 없음", null = "의도적으로 빈 값" |
| `True/False` | `true/false` | 소문자 |
| `dict` | object `{}` (키는 문자열/심볼) / `Map` | JSON과 형제 |
| `list` | `Array` | `.map/.filter/.reduce` 그대로 있음 |
| `tuple` | `[a, b] as const` (TS) | 불변 튜플 흉내 |
| `def f(x): ...` | `function f(x) {}` / `const f = (x) => {}` | 화살표 함수가 대세 |
| 타입 힌트 `x: int` (런타임 무시) | `x: number` (**컴파일 타임 강제**, 실행 시 제거) | TS의 핵심 |
| `import x from y` | `import { x } from "y"` | 이름 있는 import는 중괄호 |
| `venv` + `pip` | `node_modules` + `npm` | 프로젝트별 격리 동일 |
| `mypy` | `tsc` (TypeScript 컴파일러) | 정적 타입 검사 |
| `ruff`/`flake8` | ESLint | 린트 |
| `f"{name}"` | `` `${name}` `` (백틱, template literal) | 문자열 보간 |

가장 큰 차이 3가지:

1. **`===` vs `==`** — JS에서 `==`는 타입 강제 변환을 해서 `0 == ""`이 `true`가 되는 함정이 있다.
   **항상 `===`(엄격 동등)을 써라.** (Python `==`는 `===`에 가깝다.)
2. **`null`과 `undefined` 둘 다 있다** — "없음"이 두 종류다. 실전에선 `x == null` (느슨 비교)만
   예외적으로 써서 "null이거나 undefined"를 한 번에 검사하기도 한다.
3. **truthy/falsy가 다르다** — falsy 값: `false, 0, "", null, undefined, NaN`. Python의 빈
   리스트 `[]`는 falsy지만, **JS의 빈 배열 `[]`·빈 객체 `{}`는 truthy**다. (자주 실수하는 지점!)

---

## 2. JavaScript 핵심 문법 (실전 코드로)

### 2.1 변수 선언: `const` / `let` (그리고 `var`은 잊어라)

```js
const ORBIT_MS = 180_000;  // 재할당 불가 (Python의 상수 관례 + 실제 강제)
let progress = 0;          // 재할당 가능
// var 는 옛 문법 — 쓰지 말 것
```

**규칙: 기본은 `const`, 재할당이 필요할 때만 `let`.** (`src/lib/game.ts`의 `settle()`에서
`let progress = ...`가 루프에서 갱신되는 걸 보라.)

> ⚠️ `const`는 "재할당 불가"지 "불변(immutable)"이 아니다. `const arr = []; arr.push(1)`은 가능하다.
> 객체/배열 내용은 바꿀 수 있고, 변수가 가리키는 대상만 못 바꾼다. (Python의 `Final`과 유사.)

### 2.2 함수: 화살표 함수 & 순수 함수

`src/lib/game.ts`의 `clamp`를 보자 — 완벽한 순수 함수다:

```ts
export function clamp(v: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, v));
}
```

- `min = 0` — Python처럼 **기본 인자** 지원
- `export` — 이 함수를 다른 파일에서 쓸 수 있게 공개 (Python엔 없는 명시적 export)
- 화살표 버전: `const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));`
  (한 줄이면 `return`·중괄호 생략 = 암묵적 반환)

### 2.3 배열 고차 함수 (데이터 엔지니어에게 친숙!)

`rollDebris()` — 가중치 랜덤 추첨. `reduce`로 총합을 구한다:

```ts
export function rollDebris(): DebrisId {
  const total = DEBRIS_DEFS.reduce((s, d) => s + d.weight, 0);  // sum(d.weight for d in ...)
  let r = Math.random() * total;
  for (const d of DEBRIS_DEFS) {   // for d in DEBRIS_DEFS  (of = 값 순회)
    r -= d.weight;
    if (r <= 0) return d.id;
  }
  return DEBRIS_DEFS[0].id;
}
```

| Python | JavaScript |
|---|---|
| `[f(x) for x in xs]` | `xs.map(x => f(x))` |
| `[x for x in xs if p(x)]` | `xs.filter(x => p(x))` |
| `sum(xs)` / `reduce(...)` | `xs.reduce((acc, x) => acc + x, 0)` |
| `for x in xs:` | `for (const x of xs)` |
| `for i, x in enumerate(xs):` | `xs.forEach((x, i) => ...)` 또는 `for (const [i, x] of xs.entries())` |
| `len(xs)` | `xs.length` |
| `xs[-1]` | `xs.at(-1)` (또는 `xs[xs.length-1]`) |

> ⚠️ **`for...of` vs `for...in`**: `for...of`는 **값**을, `for...in`은 **키(인덱스)**를 순회한다.
> Python `for x in list`은 값 순회이므로 JS에선 `for...of`가 대응된다. `for...in`은 헷갈리니 배열엔 쓰지 마라.

### 2.4 구조 분해(destructuring) & 스프레드(spread)

`settle()`의 반환을 받는 쪽(`src/hooks/useGame.ts`)은 이렇게 분해한다:

```ts
const { state: next, report } = settle(prev, now);  // 객체 구조 분해 + 이름 변경
```

스프레드 `...`는 **불변 업데이트**의 핵심 도구다. `game.ts` 전체가 이 패턴이다:

```ts
return { ...state, stage: "egg", pet: { ...state.pet, color } };
// {**state, "stage": "egg", "pet": {**state["pet"], "color": color}}  (Python dict unpacking)
```

- `{ ...state, stage: "egg" }` — state를 얕게 복사하고 `stage`만 교체한 **새 객체**
- `[...a, ...b]` — 두 배열 이어붙이기 (`settle`의 `[...state.letters, ...newLetters]`)
- 이게 왜 중요한가? **React는 "새 객체가 오면 바뀐 걸로 안다"**(Day 2). 그래서 원본을
  수정하지 않고 항상 새 객체를 만든다. `game.ts`의 모든 액션 함수가 이 규약을 지킨다.

### 2.5 template literal & 옵셔널 체이닝

```ts
const url = `${origin}/og.png`;         // f"{origin}/og.png"
navigator.clipboard?.writeText(url);    // clipboard가 없으면(undefined) 호출 안 함 = 안전
const v = data?.version ?? 1;           // data가 null이면 undefined, 그럼 1 (?? = None 병합)
```

- `?.` (옵셔널 체이닝) — 앞이 `null`/`undefined`면 즉시 `undefined` 반환 (에러 안 남)
- `??` (nullish 병합) — 왼쪽이 `null`/`undefined`일 때만 오른쪽 사용
  (Python `a if a is not None else b`). **`||`와 다름**: `0 || 5`는 `5`지만 `0 ?? 5`는 `0`.

### 2.6 ES 모듈 (import/export)

```ts
// 내보내기 (game.ts)
export function clamp() {}          // 이름 있는 export (여러 개 가능)
export type Stage = ...;            // 타입도 export
export default function Game() {}   // 파일당 1개 default export

// 가져오기
import { clamp, currentMood } from "./game";   // 이름 있는 것들
import Game from "./components/Game";           // default
import type { GameState } from "./types";       // 타입만 (런타임 코드 0)
```

`@/`는 이 프로젝트의 경로 별칭이다(`tsconfig.json`의 `paths`). `import ... from "@/lib/game"` =
`src/lib/game`. Python의 절대 임포트와 비슷하다.

---

## 3. 비동기 (asyncio를 아는 당신에게)

JS는 태생이 **단일 스레드 + 이벤트 루프**다. asyncio가 Python에 나중에 붙은 반면, JS는 처음부터
이렇게 돌아간다. 그래서 개념이 거의 1:1이다.

| Python asyncio | JavaScript |
|---|---|
| `async def f():` | `async function f() {}` |
| `await coro` | `await promise` |
| `asyncio.gather(...)` | `Promise.all([...])` |
| `Future` | `Promise` |
| 이벤트 루프 | 이벤트 루프 (내장, 항상 돌고 있음) |

`src/lib/share.ts`의 실제 async 함수:

```ts
export async function copyLink(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);  // 프로미스를 기다림
      return true;
    }
  } catch {
    /* 폴백으로 진행 */
  }
  // ... execCommand 폴백
}
```

- `Promise<boolean>` — "미래에 boolean을 주는 약속" (asyncio `Future[bool]`)
- `.then()`/`.catch()`는 `await`/`try` 없이 프로미스를 다루는 옛/함수형 방식:
  `promptInstall().then((ok) => { ... })` (`src/components/InstallToast.tsx`)

> **핵심 차이**: 브라우저에는 "메인 스레드"가 곧 "UI를 그리는 스레드"다. 여기서 무거운 동기
> 작업을 하면 **화면이 멈춘다(freeze)**. 그래서 네트워크·타이머·애니메이션은 전부 비동기로 처리한다.
> 데이터 잡을 블로킹하면 안 되는 것과 같은 이유다.

---

## 4. TypeScript — 당신의 타입 힌트가 강제력을 얻는다

Python 타입 힌트는 런타임에 무시되지만(mypy로 별도 검사), **TS 타입은 컴파일 타임에 강제되고
실행 코드에선 제거**된다. `src/lib/types.ts`가 이 프로젝트의 타입 헌법이다.

### 4.1 문자열 리터럴 union 타입 (Enum보다 강력)

```ts
export type Stage =
  | "adopt" | "egg" | "name" | "raising" | "prep" | "launching" | "orbit";
export type PetColor = "mint" | "pink" | "lavender";
```

`Stage`는 저 7개 문자열 **중 하나만** 될 수 있다. 오타 `"oribt"`를 쓰면 **빌드가 실패**한다.
Python의 `Literal["adopt", "egg", ...]`와 같지만 훨씬 일상적으로 쓰인다.

### 4.2 interface (구조적 타입)

```ts
export interface GameState {
  version: 1;               // 리터럴 1 — "반드시 숫자 1" (스키마 버전 태그)
  stage: Stage;
  pet: { name: string; color: PetColor; suit: SuitColor | null };
  debris: Record<DebrisId, number>;
  letters: Letter[];
  // ...
}
```

- `version: 1` — 값이 아니라 **타입**이 리터럴 `1`. `storage.ts`가 `data.version !== 1`로
  옛 세이브를 거른다.
- `SuitColor | null` — "SuitColor이거나 null" (아직 슈트 안 입음)
- `Record<DebrisId, number>` — 키가 `DebrisId`(union)이고 값이 `number`인 객체
  (Python `dict[DebrisId, int]`). `Letter[]`는 `list[Letter]`.

### 4.3 discriminated union (판별 유니온) — TS의 킬러 기능

`src/hooks/usePwa.ts`의 설치 상태:

```ts
type InstallState = "installed" | "installable" | "ios-guide" | "manual";
```

`OrbitScreen.tsx`의 패널 종류:

```ts
type PanelKind = "letters" | "debris" | "settings" | null;
```

컴포넌트에서 `switch (panel)` 하면 TS가 **모든 경우를 다뤘는지** 검사해준다. `null` 처리를
빼먹으면 경고. 데이터 파이프라인에서 "이 레코드는 A타입 아니면 B타입"을 다루던 것과 같은데,
컴파일러가 강제해준다.

### 4.4 `typeof` 타입 & `as const`

Day 5의 i18n에서 만날 최강 패턴을 미리 맛보자:

```ts
const ko = { common: { close: "닫기" }, /* ...190개 키... */ };
export type Messages = typeof ko;   // ko 객체의 "구조"를 타입으로 추출
```

`Messages`는 `ko`가 가진 정확한 키 구조가 된다. 그래서 `en.ts`가 키 하나라도 빠뜨리면
**빌드가 실패**한다. "번역 누락을 컴파일러가 잡는다." (Python엔 이런 게 거의 없다.)

`as const`는 값을 "가장 좁은 리터럴 타입 + 불변"으로 고정한다:

```ts
return [e.clientX - r.left, e.clientY - r.top] as const;  // 타입: readonly [number, number]
```

### 4.5 제네릭 (Generics)

```ts
useState<GameState | null>(null)          // 상태 타입 명시
new Map<DebrisId, number>()               // dict[DebrisId, int]
useRef<ReturnType<typeof setTimeout> | null>(null)  // 타이머 핸들 타입 추론
```

Python `TypeVar`/`Generic`과 개념 동일하나 훨씬 자주 쓴다. `ReturnType<typeof setTimeout>`은
"setTimeout이 돌려주는 타입"을 뽑아내는 유틸 타입이다.

---

## 5. 툴체인 (당신의 Python 도구에 대응)

`package.json` — `pyproject.toml`/`requirements.txt`에 해당. 이 프로젝트 것:

```jsonc
{
  "scripts": {
    "dev": "next dev --turbopack",     // 개발 서버 (HMR)
    "build": "next build --turbopack", // 프로덕션 빌드 + 타입체크
    "start": "next start",             // 빌드 결과 실행
    "lint": "eslint"                   // 린트
  },
  "dependencies": {                    // 런타임 의존성 (install_requires)
    "react": "19.1.0", "react-dom": "19.1.0", "next": "15.5.20"
  },
  "devDependencies": {                 // 개발 전용 (extras/dev)
    "typescript": "^5", "tailwindcss": "^4", "eslint": "^9", /* ... */
  }
}
```

- `npm run dev` = 스크립트 실행 (`npm run <이름>`)
- `^5` = "5.x.x 중 최신 호환" (semver, `~=5.0` 느낌). `19.1.0`처럼 고정도 가능.
- `package-lock.json` = `poetry.lock`/`pip freeze` (정확한 버전 잠금 — 커밋해야 함)

`tsconfig.json` — mypy 설정에 해당. 핵심:

```jsonc
{
  "compilerOptions": {
    "strict": true,                    // 엄격 모드 (mypy --strict)
    "target": "ES2017",                // 어느 JS 버전으로 컴파일할지
    "moduleResolution": "bundler",
    "noEmit": true,                    // 타입 검사만, JS 출력은 Next가 함
    "paths": { "@/*": ["./src/*"] }    // 경로 별칭
  }
}
```

`eslint.config.mjs` — 이 프로젝트는 `next/core-web-vitals`, `next/typescript` 규칙을 상속한다
(flat config). ESLint는 "버그 유발 패턴·스타일"을 잡고, TS는 "타입"을 잡는다. 역할이 다르다.

---

## 6. 실습 (에디터를 열고 직접)

### 실습 A — 순수 로직 정독·추적 (30분)

1. `src/lib/types.ts`를 처음부터 끝까지 읽어라. 각 `type`/`interface`가 게임의 무엇을
   모델링하는지 한 줄씩 주석으로 (머릿속에) 달아보라.
2. `src/lib/game.ts`의 `settle()`을 손으로 따라가라: `dt`가 뭐고, `progress`가 어떻게 1을 넘어
   쓰레기를 획득하는지. Python 함수로 옮겨 쓴다면 어떻게 될지 상상해보라 — 거의 그대로다.
3. `orbitInfo()`의 `phase`·`off`·`inWindow` 계산을 종이에 그려라 (원 궤도의 각도).

### 실습 B — 작은 수정 (30분)

> ⚠️ 실습용 수정이다. 커밋하지 말고, 확인 후 되돌려라(`git checkout .`).

1. `src/lib/game.ts`의 `clamp` 기본 인자를 바꿔보고(`min = 10`), `npm run build`가 통과하는지 확인.
2. `nameAndStart`의 `name.trim().slice(0, 16)`에서 `16`을 `4`로 바꾸고 `npm run dev`로 이름을
   길게 지어보라 — 잘리는 걸 눈으로 확인. (왜 slice로 길이를 제한하는지 체감)
3. `types.ts`의 `PetColor`에 `"gold"`를 **추가하지 말고**, 컴포넌트에서 `color = "gold"`를
   써보라. 빌드가 어떻게 막는지 보라 — 이게 union 타입의 힘이다. 확인 후 지워라.

---

## 7. 연습문제

1. **(15분) 대응 표 완성** — 아래 Python을 JS/TS로 바꿔 써라:
   ```python
   names = [p["name"] for p in pets if p["mood"] >= 50]
   total = sum(d["weight"] for d in debris)
   first = pets[0] if pets else None
   ```
2. **(20분) 순수 함수 작성** — `src/lib/game.ts` 스타일로, `GameState`를 받아 "읽지 않은 편지 수"를
   반환하는 순수 함수 `unreadCount(state: GameState): number`를 종이에 써보라. (`.filter().length`)
3. **(15분) 타입 설계** — 게임에 "업적(achievement)" 개념을 넣는다면 `types.ts`에 어떤 union/interface를
   추가할지 스케치하라. (`type AchievementId = ...`, `interface Achievement { ... }`)

---

## 8. 자가 체크리스트

- [ ] `const`/`let`을 구분해서 쓰고, `===`만 쓴다
- [ ] `null`과 `undefined`, truthy/falsy(특히 `[]`는 truthy)를 안다
- [ ] `.map/.filter/.reduce`와 `for...of`, 구조 분해·스프레드를 Python 대응으로 읽는다
- [ ] `async/await`·`Promise`를 asyncio 지식으로 설명할 수 있다
- [ ] union·interface·`Record`·discriminated union·`typeof`·제네릭을 실전 코드에서 읽는다
- [ ] `package.json`/`tsconfig.json`/ESLint의 역할을 Python 도구에 대응시킬 수 있다

---

## 9. 더 읽기

- MDN: [JavaScript 첫걸음](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) (특히 Everyday Types, Narrowing)
- [MDN: 옵셔널 체이닝 `?.`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- 곁에 두기: [Python → Web 치트시트](./cheatsheet-python-to-web.md)

다음 → [Day 2: React 19](./day-2-react.md)
