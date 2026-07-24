# Foundations — JavaScript (심화 문법 · 배경 지식, 우리 코드로)

← [인덱스로](./README.md) · 짝: [HTML 기초](./foundations-html.md) · [CSS 기초](./foundations-css.md)

> **누구를 위한 문서인가**: [Day 1](./day-1-javascript-typescript.md)에서 문법 기초(const/let·
> 배열 함수·async·타입)를 봤다면, 이 문서는 그 **아래의 배경·심화 메커니즘**(엔진·스코프·클로저·
> `this`·이벤트·에러처리)을 우리 코드로 파고든다. Day 1과 짝을 이룬다.
> **예상 소요**: 2.5~3시간 (개념 2h + 실습 1h)

---

## 0. 배경 지식 — JavaScript는 어떤 언어인가

- **탄생**: 1995년 브라우저를 움직이려 만들어졌다. 이제는 브라우저·서버(Node)·모바일 어디서나 돈다.
- **표준**: **ECMAScript(ES)**. "ES2015(ES6)", "ES2017" 같은 연도판. 우리 `tsconfig`의 `target: ES2017`은
  "이 버전 문법으로 컴파일"이라는 뜻.
- **엔진**: 크롬·Node는 **V8**, 사파리는 JavaScriptCore. JS를 JIT 컴파일해 빠르게 실행.
- **성격**: 동적 타입(그래서 TS로 타입을 얹음), 함수가 일급 값(변수·인자로 전달), 프로토타입 기반
  객체지향, **단일 스레드 + 이벤트 루프**(Day 4).

> Python과 대조: 둘 다 동적·인터프리터(계열)·일급 함수. 큰 차이는 JS의 **어디서나 도는 이벤트
> 루프 런타임**과 **프로토타입 기반 객체 모델**, 그리고 **`this`의 특이한 규칙**이다.

---

## 1. 스코프(scope)와 클로저(closure) — 가장 중요한 심화

### 스코프 — 변수가 보이는 범위

- `let`/`const`는 **블록 스코프**(`{ }` 안). `var`는 함수 스코프(옛 문법, 쓰지 마라).
- 안쪽 함수는 바깥 변수를 **읽을 수 있다**(렉시컬 스코프 = 코드가 쓰인 위치 기준).

```js
function outer() {
  const secret = 42;          // outer의 스코프
  function inner() { return secret; }  // 바깥 변수 접근 가능
  return inner;
}
```

### 클로저 — "함수가 자기 태어난 환경을 기억한다"

함수를 반환하거나 콜백으로 넘기면, 그 함수는 **정의될 때의 바깥 변수들을 계속 붙잡는다**. 이게
클로저다. 우리 `Hearts.tsx`의 `useHearts`가 실전 예:

```tsx
export function useHearts() {
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(0);

  const spawn = (x, y, emoji = "💗") => {
    const id = idRef.current++;                 // 바깥 idRef를 클로저로 붙잡음
    setHearts((h) => [...h, { id, x, y, emoji }]);
    setTimeout(() => {
      setHearts((h) => h.filter((it) => it.id !== id));  // 1.2초 뒤 콜백이 이 id를 기억!
    }, 1200);
  };
  return { hearts, spawn };
}
```

- `setTimeout`의 콜백은 1.2초 뒤 실행되지만, **그때도 자기 `id`를 정확히 기억**한다 — 클로저 덕분.
- 각 `spawn` 호출마다 **새로운 `id`를 가둔 새 클로저**가 생긴다. 그래서 하트마다 제 id로 제거된다.

> **stale closure 함정(Day 2 연결)**: 클로저가 **옛** 값을 붙잡아 생기는 버그. `useEffect` 콜백이
> 오래된 state를 기억하는 경우가 대표적. 우리 `useGame`은 `stateRef.current`로 **항상 최신값을
> 읽어** 이를 피한다. 클로저를 이해하면 이 버그가 왜 생기고 왜 ref로 푸는지 보인다.

---

## 2. `this` 키워드와 화살표 함수 — JS 특유의 함정

`this`는 **함수를 어떻게 호출했느냐**에 따라 달라진다 (정의 위치가 아니라!). Python의 명시적
`self`와 달리 암묵적이라 헷갈린다.

- 일반 함수: `this`는 호출 방식에 따라 바뀜 (메서드 호출이면 그 객체, 그냥 호출이면 `undefined`/전역).
- **화살표 함수**: 자기 `this`가 없고 **바깥(정의된 곳)의 `this`를 그대로** 쓴다 (렉시컬 this).

**그래서 우리 코드는 거의 다 화살표 함수를 쓴다** — 콜백·이벤트 핸들러에서 `this` 혼란이 없기
때문:

```tsx
onClick={() => setName(s)}                      // 화살표: this 걱정 없음
onChange={(e) => setName(e.target.value)}
const spawn = (x, y) => { ... };                // 클로저 + 렉시컬 this
```

> 실무 규칙: **콜백·핸들러·짧은 함수는 화살표 함수**. `class` 메서드나 객체 메서드가 아니면
> `this`를 거의 쓸 일이 없다(React 함수 컴포넌트 시대엔 특히). 이 프로젝트엔 `class`가 없다.

---

## 3. 호이스팅(hoisting) — 선언이 위로 끌어올려진다

JS는 실행 전에 선언을 스캔한다.

- **함수 선언(`function f(){}`)** 은 통째로 호이스팅 → 정의 전에 호출 가능.
- **`const`/`let`** 은 호이스팅되지만 **초기화 전 접근은 에러**(TDZ, 일시적 사각지대) → 정의 후에만 사용.

```js
foo();                       // OK — 함수 선언은 호이스팅
function foo() {}

bar();                       // ❌ ReferenceError (TDZ)
const bar = () => {};
```

> 실무에선 "쓰기 전에 정의한다"만 지키면 문제없다. 우리 `game.ts`처럼 `export function`을 위에
> 두고 쓰는 게 안전한 관례.

---

## 4. 객체와 프로토타입 (배경 지식)

JS 객체는 **키-값 묶음**이고, 다른 객체를 **프로토타입**으로 두어 속성을 상속한다(프로토타입 체인).

```js
const pet = { name: "별이", color: "mint" };
pet.name;            // "별이"  (점 접근)
pet["color"];        // "mint"  (대괄호 접근 — 동적 키)
Object.keys(pet);    // ["name", "color"]
"name" in pet;       // true
```

- `Array`·`String`의 `.map`·`.trim` 같은 메서드는 그들의 **프로토타입**에 있다. 그래서 모든
  배열이 `.map`을 쓴다. (`Array.prototype.map`)
- `class`는 프로토타입 위의 문법 설탕. 이 프로젝트는 함수형이라 `class`를 안 쓰지만, 라이브러리·
  DOM API(`new Notification()`, `new AudioContext()`, `new Map()`)에서 만난다.

> Python의 클래스·MRO(메서드 결정 순서)에 대응하는 게 프로토타입 체인이다. 개념은 비슷하되
> 문법·동작이 다르다. 깊이는 나중에 — 지금은 "메서드는 프로토타입에서 온다"만 알면 충분.

---

## 5. 이벤트 처리 — 사용자 입력에 반응하기

브라우저는 클릭·입력·포인터 등을 **이벤트**로 발생시키고, 핸들러가 반응한다.

### 이벤트 객체

핸들러는 **이벤트 객체(`e`)** 를 받는다. 정보가 다 여기 있다:

```tsx
// NameScreen — 입력 이벤트
onChange={(e) => setName(e.target.value)}   // e.target = 이벤트가 난 요소, .value = 현재 값

// OrbitScreen — 포인터 이벤트에서 좌표 뽑기
const onPetTap = (e: React.PointerEvent<HTMLDivElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  spawn(e.clientX - rect.left, e.clientY - rect.top);   // 클릭 좌표 → 요소 상대좌표
};
```

- `e.target` — 이벤트가 실제 발생한 요소. `e.currentTarget` — 핸들러가 붙은 요소.
- `e.clientX/Y` — 화면상 포인터 좌표.

### 버블링(bubbling)과 preventDefault

- **버블링**: 이벤트는 자식 → 부모로 **거슬러 전파**된다. 부모에 핸들러 하나로 여러 자식을 처리할 수
  있음(이벤트 위임). `e.stopPropagation()`으로 멈춤.
- **기본동작 취소**: `e.preventDefault()` — 폼 제출·링크 이동 같은 브라우저 기본 반응을 막는다.
  우리 `usePwa`가 `beforeinstallprompt`에서 `e.preventDefault()`로 기본 설치 배너를 가로챈다.

### React 이벤트 vs DOM 이벤트

- React는 `onClick`/`onChange`/`onPointerDown` 같은 **합성 이벤트(SyntheticEvent)** 를 제공한다
  (브라우저 차이를 흡수한 래퍼). 우리 컴포넌트가 쓰는 게 이것.
- `SpacewalkGame`처럼 성능이 필요한 곳은 **원시 DOM 이벤트**(`element.addEventListener("pointermove",
  ...)`)를 직접 쓴다. 반드시 `removeEventListener`로 정리(누수 방지, Day 2 클린업).

---

## 6. 에러 처리 — try / catch / throw

```ts
// storage.ts — 손상된 세이브에도 앱이 안 죽게 방어
export function loadGame(): GameState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;   // 깨진 JSON이면 throw
    if (data?.version !== 1) return null;
    return data;
  } catch {
    return null;                                  // 실패해도 null로 우아하게
  }
}
```

- `try { } catch (e) { }` — Python `try/except`와 동일 개념. `finally`도 있다.
- `throw new Error("메시지")` — 예외 발생 (Python `raise`).
- 우리 코드의 방어 패턴: **브라우저 API·JSON·네트워크는 실패할 수 있으니 try/catch로 감싸고
  폴백**한다 (`share.ts`의 클립보드, `storage.ts`의 저장). 데이터 파이프라인에서 외부 I/O를
  방어하는 것과 같은 습관.

> 비동기 에러: `await` 하는 코드의 에러도 `try/catch`로 잡는다. `.then().catch()` 체인이면 `.catch()`.

---

## 7. JSON & 직렬화 — 상태를 문자열로

localStorage·네트워크는 **문자열만** 다루므로, 객체를 문자열로 바꿔야 한다.

```ts
localStorage.setItem(KEY, JSON.stringify(state));   // 객체 → JSON 문자열
const data = JSON.parse(raw) as GameState;          // JSON 문자열 → 객체
```

- `JSON.stringify`(직렬화) / `JSON.parse`(역직렬화). Python `json.dumps`/`json.loads`와 1:1.
- **주의**: 함수·`undefined`·`Map`/`Set`은 JSON으로 안 넘어간다(사라지거나 변형). 순수 데이터만.
  우리 `GameState`는 원시값·객체·배열뿐이라 안전하다.

---

## 8. 값·참조와 불변성 (Day 1·2 심화)

- **원시값**(number·string·boolean·null·undefined)은 **복사**로 전달(값 전달).
- **객체·배열**은 **참조**로 전달. 그래서 함수에 넘긴 객체를 안에서 바꾸면 바깥도 바뀐다.
- React가 변경을 감지하는 법 = **참조가 바뀌었나?**(얕은 비교). 그래서 Day 1·2의 **불변 업데이트**
  (`{ ...state }`, `[...arr]`)가 필수다 — 새 참조를 만들어야 React가 "바뀜"을 안다.

```ts
const a = { n: 1 };
const b = a;        // 같은 객체를 가리킴 (참조 복사)
b.n = 2;            // a.n 도 2! (같은 객체)
const c = { ...a }; // 새 객체 (별개) — 이게 불변 업데이트
```

이 한 가지가 "왜 `push` 대신 `[...arr, x]`인가"의 근본 이유다.

---

## 9. 실습

> ⚠️ 확인 후 `git checkout .`.

### 실습 A — 클로저 실험 (30분)

1. 브라우저 콘솔(F12)에서:
   ```js
   function counter() { let n = 0; return () => ++n; }
   const c = counter(); c(); c(); c();   // 1, 2, 3 — n을 기억한다(클로저)
   ```
2. `Hearts.tsx`의 `spawn`에서 `setTimeout` 콜백이 어떻게 자기 `id`를 기억하는지 코드로 따라가라.
   여러 하트를 빠르게 스폰해도 각자 제 id로 사라지는 이유를 설명하라.

### 실습 B — 이벤트 객체 관찰 (30분)

1. `NameScreen`의 `onChange`를 `onChange={(e) => { console.log(e.target.value); setName(e.target.value); }}`로
   바꾸고, 입력하며 콘솔에 찍히는 이벤트 값을 관찰하라.
2. `OrbitScreen`의 `onPetTap`에 `console.log(e.clientX, e.clientY, rect)`를 넣어 좌표 변환을 눈으로 봐라.

### 실습 C — 에러 처리·JSON (20분)

1. 콘솔에서 `JSON.parse("{깨진}")`을 실행해 에러를 보고, `try { JSON.parse("{깨진}") } catch(e){ console.log("잡음", e.message) }`로 감싸 보라.
2. `localStorage.getItem("astropet-save-v1")`로 세이브 문자열을 꺼내 `JSON.parse`한 뒤 `state.debrisTotal`을 읽어보라.

---

## 10. 연습문제

1. **(20분)** 클로저를 정의하고, `useHearts`의 `spawn`/`setTimeout`이 클로저로 어떻게 각 하트의
   `id`를 기억하는지 설명하라. stale closure가 뭐고 `useGame`이 어떻게 피하는지도.
2. **(15분)** 왜 우리 코드는 콜백에 화살표 함수를 쓰나? 일반 함수의 `this`와 화살표 함수의 `this`
   차이를 예로 설명하라.
3. **(20분)** 값 전달과 참조 전달의 차이를 예로 들고, React에서 왜 불변 업데이트(`{...state}`)가
   필요한지 참조 관점으로 설명하라.
4. **(15분)** 이벤트 버블링과 `preventDefault`를 설명하고, `usePwa`가 `beforeinstallprompt`에서
   `preventDefault`를 왜 부르는지 답하라.
5. **(15분)** `JSON.stringify`/`parse`로 넘어가지 않는 값(함수·`Map`·`undefined`)을 말하고,
   `storage.ts`가 왜 안전한지 설명하라.

---

## 11. 자가 체크리스트

- [ ] 스코프와 클로저를 설명하고, `useHearts`/`useGame`에서 실전 예를 짚는다
- [ ] `this`가 호출 방식에 좌우됨을, 화살표 함수가 왜 안전한지를 안다
- [ ] 호이스팅·TDZ를 알고 "쓰기 전에 정의" 관례를 지킨다
- [ ] 객체·프로토타입의 기초와 `class`/`new`가 어디서 쓰이는지 안다
- [ ] 이벤트 객체·버블링·`preventDefault`, React 합성 이벤트 vs DOM 이벤트를 구분한다
- [ ] try/catch 방어 패턴과 JSON 직렬화, 값/참조·불변성을 우리 코드로 설명한다

---

## 12. 더 읽기

- [MDN — JavaScript 안내서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide)
- [MDN — 클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)
- [MDN — this](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/this)
- [MDN — 이벤트 소개](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events)
- [javascript.info](https://ko.javascript.info/) (한국어, 깊이 있는 무료 교재)

이어서 → [Day 1: JS/TS](./day-1-javascript-typescript.md) · [Day 2: React](./day-2-react.md)
