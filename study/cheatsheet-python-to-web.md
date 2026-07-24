# 치트시트 — Python → JavaScript / TypeScript / React

← [인덱스로](./README.md)

Python 백엔드·데이터 엔지니어를 위한 빠른 대응표. 막힐 때 여기부터 보라.

---

## 1. 언어 기본

| Python | JavaScript / TypeScript |
|---|---|
| `x = 1` | `const x = 1;` (재할당 X) / `let x = 1;` (재할당 O) |
| `x: int = 1` | `const x: number = 1;` (타입 강제, 컴파일 타임) |
| `None` | `null` (의도적 없음) / `undefined` (미할당) |
| `True` / `False` | `true` / `false` |
| `and` / `or` / `not` | `&&` / `\|\|` / `!` |
| `==` (값 비교) | `===` (엄격 비교 — **항상 이걸**) |
| `is None` | `=== null` / `=== undefined` / `== null`(둘 다) |
| `a if cond else b` | `cond ? a : b` (삼항 연산자) |
| `a or default` | `a ?? default` (null/undefined일 때만) |
| `f"{name}: {n}"` | `` `${name}: ${n}` `` (백틱) |
| `#` 주석 | `//` 한 줄, `/* */` 여러 줄 |
| `pass` | `{}` (빈 블록) |
| `raise ValueError(...)` | `throw new Error(...)` |
| `try/except/finally` | `try/catch/finally` |
| `assert x` | `if (!x) throw new Error(...)` (내장 assert 없음) |

**truthy/falsy 함정**: Python에서 `[]`·`{}`·`0`·`""`는 falsy. JS에서 **`0`·`""`·`null`·
`undefined`·`NaN`·`false`만 falsy** — **`[]`와 `{}`는 truthy!** (`if (arr)`는 빈 배열도 통과)

---

## 2. 자료구조

| Python | JavaScript |
|---|---|
| `list` `[1, 2, 3]` | `Array` `[1, 2, 3]` |
| `dict` `{"k": 1}` | `object` `{ k: 1 }` (키는 문자열/심볼) / `Map` |
| `tuple` `(1, 2)` | `[1, 2] as const` (불변 흉내) |
| `set` `{1, 2}` | `new Set([1, 2])` |
| `len(x)` | `x.length` (배열/문자열) / `x.size` (Map/Set) |
| `x.append(v)` | `x.push(v)` |
| `x[-1]` | `x.at(-1)` |
| `x[1:3]` | `x.slice(1, 3)` |
| `k in d` | `k in obj` / `obj.hasOwnProperty(k)` / `map.has(k)` |
| `d.get(k, default)` | `obj[k] ?? default` / `map.get(k) ?? default` |
| `d.keys()/.values()/.items()` | `Object.keys/values/entries(obj)` |
| `{**a, **b}` | `{ ...a, ...b }` (스프레드) |
| `[*a, *b]` | `[...a, ...b]` |
| `a, b = pair` | `const [a, b] = pair;` (구조 분해) |
| `d["a"], d["b"]` 꺼내기 | `const { a, b } = obj;` (구조 분해) |

---

## 3. 반복 & 고차 함수 (데이터 처리)

| Python | JavaScript |
|---|---|
| `for x in xs:` | `for (const x of xs) { }` |
| `for i, x in enumerate(xs):` | `xs.forEach((x, i) => { })` |
| `for k, v in d.items():` | `for (const [k, v] of Object.entries(d))` |
| `[f(x) for x in xs]` | `xs.map(x => f(x))` |
| `[x for x in xs if p(x)]` | `xs.filter(x => p(x))` |
| `sum(xs)` | `xs.reduce((a, x) => a + x, 0)` |
| `functools.reduce(f, xs, init)` | `xs.reduce(f, init)` |
| `sorted(xs, key=fn)` | `[...xs].sort((a, b) => fn(a) - fn(b))` |
| `any(p(x) for x in xs)` | `xs.some(x => p(x))` |
| `all(p(x) for x in xs)` | `xs.every(x => p(x))` |
| `next(x for x in xs if p(x))` | `xs.find(x => p(x))` |
| `range(n)` | `Array.from({ length: n }, (_, i) => i)` |
| `zip(a, b)` | `a.map((x, i) => [x, b[i]])` |

> ⚠️ `sort`는 **원본을 변형**하고 기본이 문자열 정렬이다. 숫자는 `(a,b)=>a-b` 비교자 필수.
> 불변을 원하면 `[...xs].sort(...)`.

---

## 4. 함수

| Python | JavaScript |
|---|---|
| `def f(x): return x + 1` | `function f(x) { return x + 1; }` |
| `lambda x: x + 1` | `(x) => x + 1` |
| `def f(x, y=0):` | `function f(x, y = 0) {}` |
| `def f(*args):` | `function f(...args) {}` |
| `def f(**kwargs):` | `function f(opts) {}` (객체로 받음) |
| `f(a, b=2)` (키워드 인자) | `f(a, { b: 2 })` (객체 관례) |
| 데코레이터 `@wraps` | 고차 함수 `withX(fn)` (문법적 데코레이터는 실험 단계) |
| 클로저 | 클로저 (동일 개념) |
| `yield` (제너레이터) | `function*` + `yield` |

---

## 5. 비동기 (asyncio ↔ Promise)

| Python asyncio | JavaScript |
|---|---|
| `async def f():` | `async function f() {}` |
| `await coro` | `await promise` |
| `asyncio.gather(a, b)` | `Promise.all([a, b])` |
| `asyncio.wait_for` / 첫 완료 | `Promise.race([...])` / `Promise.any([...])` |
| `Future` | `Promise` |
| `loop.call_later` | `setTimeout(fn, ms)` |
| 주기 실행 | `setInterval(fn, ms)` (+ `clearInterval`) |
| `Task` 취소 | `AbortController` / `clearTimeout` |

```js
// 프로미스 3가지 소비 방식
await fetch(url);                       // async 함수 안에서
fetch(url).then(r => ...).catch(e => ...); // 체이닝
Promise.all([a, b]).then(([ra, rb]) => ...);
```

---

## 6. 타입 (mypy ↔ TypeScript)

| Python typing | TypeScript |
|---|---|
| `int` / `float` | `number` (하나로 통합) |
| `str` | `string` |
| `bool` | `boolean` |
| `list[int]` | `number[]` / `Array<number>` |
| `dict[str, int]` | `Record<string, number>` |
| `tuple[int, str]` | `[number, string]` |
| `Optional[int]` / `int \| None` | `number \| null` / `number \| undefined` |
| `Union[A, B]` | `A \| B` |
| `Literal["a", "b"]` | `"a" \| "b"` |
| `Any` | `any` (지양) / `unknown` (안전) |
| `TypedDict` / `dataclass` | `interface` / `type` |
| `Protocol` | `interface` (구조적 타이핑) |
| `TypeVar` / `Generic[T]` | `<T>` 제네릭 |
| `Final` | `const` / `readonly` / `as const` |
| `cast(T, x)` | `x as T` |
| `type(x)` 기반 분기 | discriminated union + `switch` |
| (없음) | `typeof obj` (값 → 타입 추출) — 킬러 기능 |

---

## 7. 모듈 & 패키징

| Python | JavaScript / Node |
|---|---|
| `import os` | `import os from "os"` |
| `from x import y` | `import { y } from "x"` |
| `from x import y as z` | `import { y as z } from "x"` |
| `import x as np` | `import * as np from "x"` |
| `__init__.py` export | `export` / `export default` |
| `requirements.txt` / `pyproject.toml` | `package.json` |
| `pip install x` | `npm install x` |
| `pip install -r ...` | `npm install` |
| `venv` | `node_modules` (프로젝트 로컬) |
| `python -m pytest` | `npm run <script>` |
| `poetry.lock` / `pip freeze` | `package-lock.json` |
| `mypy` | `tsc` / `npm run build` |
| `ruff` / `black` / `flake8` | `eslint` / `prettier` |

---

## 8. React 특유 (Python엔 대응 없음)

| 개념 | 요점 |
|---|---|
| 컴포넌트 | JSX를 반환하는 대문자 함수 = `UI = f(props, state)` |
| `useState` | 렌더 간 유지되는 상태. `const [x, setX] = useState(0)` |
| `useEffect` | 렌더 후 부수효과 + 클린업. 의존성 배열로 실행 시점 제어 |
| `useRef` | 리렌더 없는 값 상자 / DOM 참조 |
| `useContext` | prop drilling 없이 전역값 공유 |
| props | 부모→자식 데이터 (읽기 전용) |
| 불변 업데이트 | `setItems([...items, x])` — 원본 수정 금지 |
| `key` | 리스트 항목의 정체성 (리렌더 vs 리마운트) |
| `"use client"` | 이 컴포넌트를 브라우저에서 실행 (훅·이벤트·window 사용 가능) |

---

## 9. 자주 쓰는 이디엄

```js
// 기본값 + null 병합
const name = input.trim() || defaultName;    // 빈 문자열이면 기본값
const v = obj?.a?.b ?? fallback;              // 안전 접근 + 폴백

// 조건부 렌더 (JSX)
{isOpen && <Panel />}                          // isOpen이면 렌더
{count > 0 ? <Badge n={count} /> : null}       // 삼항

// 객체 불변 업데이트
const next = { ...state, mood: 100 };
const withoutKey = (({ drop, ...rest }) => rest)(obj);  // 키 제거

// 배열 불변 업데이트
const added = [...arr, item];
const removed = arr.filter(x => x.id !== id);
const updated = arr.map(x => x.id === id ? { ...x, done: true } : x);

// 그룹핑 (dict 누적)
const counts = new Map();
for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
```

---

← [인덱스로](./README.md) · 관련: [Web API 레퍼런스](./web-apis-reference.md) · [용어집](./glossary.md)
