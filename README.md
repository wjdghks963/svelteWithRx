# Svelte

Svelte는 사용자가 브라우저에서 보고 상호 작용하는 탐색 모음, 댓글 섹션 또는 연락처 양식과 같은 사용자 인터페이스 구성 요소를 작성하는 방법

Svelte 컴파일러는 구성 요소를 페이지의 HTML을 렌더링하기 위해 실행할 수 있는 JavaScript와 페이지의 스타일을 지정하는 CSS로 변환한다.

1. SSR, CSR을 지원한다.
2. webpack 대신 기본적으로 vite를 사용한다.
3. src/routes 폴더를 기준으로 directory routing 기능 제공한다.

## 프로젝트 구성

- src

  - /lib : 배포용 라이브러리 코드(유틸리티, 구성요소)
    - /server : 서버 전용 라이브러리 코드 => client 코드에서 가져오는 것을 방지
  - /params : Application에 필요한 모든 매개변수 포함
  - /routes : Application 경로
  - app.html : page template

    - %sveltekit.head% : 앱에 필요한 요소 및 `<link>모든 콘텐츠<script>` `<svelte:head>`
    - %sveltekit.body% : 렌더링된 페이지의 마크업. `<body>` 내부가 아니라 `<div>` 또는 다른 요소 내부에 있어야 브라우저 확장 프로그램이 요소를 주입한 다음 hydration 과정에 의해 파괴되는 버그를 방지할 수 있다.
    - %sveltekit.assets% : path.assets or paths.base에 대한 상대 경로
    - %sveltekit.nonce% : 수동으로 포함된 링크 및 스크립트에 대한 [CSP](https://kit.svelte.dev/docs/configuration#csp) nonce(사용되는 경우)
    - %sveltekit.env.[NAME]% - 렌더링 시 [NAME] 환경 변수로 대체되며 publicPrefix(일반적으로 PUBLIC\_)로 시작해야 한다. 일치하지 않으면 ''로 대체

  - error.html : 렌더링에 실패할 때 보여지는 페이지로 아래와 같은 placeholder들을 제공한다.

    - %sveltekit.status% : HTTP status
    - %sveltekit.error.message% : error message

  - hooks.client.js : client hooks 포함
  - hooks.server.js : server hooks 포함
  - service-worker.js : service worker 포함

- static : robots.txt or favicon 같은 정적인 assets들이 들어감
- tests : 만약 Vitest를 추가한다면 test 코드가 추가될 수 있다.
- package.json : @sveltejs/kit, svelte, vite는 devDependencies로 꼭 필요하다.
- svelte.config.js : SvelteKit, Svelte에 대한 설정 파일
- tsconfig.json : for TS setting
- vite.config.js : SvelteKit 프로젝트는 다른 Vite 구성과 함께 @sveltejs/kit/vite 플러그인을 사용하는 Vite 프로젝트

<br>

## Route

디렉토리 기준으로 라우팅 기능이 제공된다.

- src/route => /
- src/routes/about = > /about
- src/routes/about/[slug] /about/231 or /about/123 ...

페이지 이동을 위한 경로를 탐색할때 `<Link>`가 아니라 `<a>` 를 사용한다.

### Page

기본적으로 SSR, CSR에서 렌더링된다.

+page.svelte는 라우트되는 폴더 안에서 기본적으로 가지고 있는 페이지에 대한 파일이다. => /src/route/about/+page.svelte 는 /about에 표시되는 파일이다.

페이지는 렌더링되기 전에 일부 데이터를 로드해야할 경우가 생기는데 이를 위해 [`load`](https://kit.svelte.dev/docs/load)함수를 내보내는 모듈인 +page.js를 추가한다.

#### page.js

```javascript
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	throw error(404, 'Not found');
}
```

load 함수는 +page.svelte와 함께 실행된다. => client 이동을 할때 SSR로 서버에서 돌아간다.
또한 이 파일에서는 페이지가 어떤 식으로 동작할지 설정할 수 있다.

```javascript
export const prerender = true or false or 'auto'
export const ssr = true or false
export const csr = true or false
```

#### +page.svelte

```javascript
<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>
```

#### +page.server.js

load 함수가 서버에서만 동작될 수 있는 경우 ex) DB에서 데이터 접근 or 환경변수의 비밀키에 접근 page.js를 page.server.js로 바꾸어 서버에서 로드할 수 있게끔한다.

```javascript
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);

	if (post) {
		return post;
	}

	throw error(404, 'Not found');
}
```

#### +layout.svelte

Application level에서 전체적으로 적용해야하는 layout이 존재하는 경우 `<slot>`을 이용해서 적용한다.

이 파일 안에서 `<slot>`을 사용한다면 다른 페이지로 이동할 때 표시되는 것들은 이곳에 표시된다. 이외에 layout에 표시되는 컴포넌트들은 계속 그 자리를 지키고 interface로 나온다.

#### +layout.js

+page.svelte와 같이 +page.js에서 데이터를 받는다.

```javascript
/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		sections: [
			{ slug: 'about', title: 'About' },
			{ slug: 'main', title: 'Main' }
		]
	};
}
```

#### +server

page 뿐 아니라 응답을 완전히 제어할 수 있는 +server.js로 경로를 정의할 수 있다. 이 파일은 HTTP method를 export할 수 있다.

**GET**

```javascript
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');

	const d = max - min;

	if (isNaN(d) || d < 0) {
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}

	const random = min + Math.random() * d;

	return new Response(String(random));
}
```

**POST**

```javascript
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

# Rxjs

Rxjs는 관찰 가능한 시퀀스를 사용해 비동기 및 이벤트 기반 프로그램을 구성하기 위한 라이브러리다.

따라서 비동기인 UI처리를 하는 프론트엔드에 유용한 라이브러리다. => 하지만 react는 reactive는 아니지만 그와 비슷한 느낌을 낼 수 있게 구현하고 있다.

[svelte & rxjs 영업 블로그글](https://velog.io/@teo/Svelte-Rxjs-Vite-AdorableCSS)

## 가장 중요한 concepts

- Observable : 미래의 값이나 이벤트를 호출 가능한 컬렉션 아이디어를 나타낸다.

- Observer : Observable이 전달한 값을 수신하는 방법을 알고 있는 콜백 모음

- Subscription : Observable의 실행을 나타내며 주로 실행을 취소하는데 유용하다.

- Operators : map, filter, concat, reduce 등 작업으로 컬렉션을 처리하는 기능적 프로그래밍 스타일을 가능하게 하는 순수 함수

- Subject : EventEmitter와 동일하며 값이나 이벤트를 여러 Observer들에게 멀티 캐스팅하는 유일한 방법

- Schedulers : 동시성을 제어하는 중앙 집중식 디스패처 ex) 계산이 발생할 때 조정할 수 있거나 setTimeout 등...

## Store

Svelte는 컴포넌트 간 데이터를 공유하는 방법으로 Store를 제공한다. => React의 Redux와 같은 상태관리 툴을 프레임워크 내에서 제공

어디에서나 svelte/store에서 제공해주는 기능으로 Global하게 접근 가능한 **값**을 만들어준다.

### writable(initialValue)

store 모듈에 존재하는 writable 함수를 이용해 읽고 쓰는 값을 생성할 수 있다.

```javascript
import { writable } from 'svelte/store';

const count = writable(0);

// oneComponent
import { count } from './store';

// 1. subscribe 메서드를 이용해 구독
count.subscribe((value) => value);

// 2. 선언식을 사용해 간단하게 표현 count가 어디서든 바뀐다면 계산 및 컴포넌트를 업데이트 한다.
$count;
```

count라는 값을 읽기 위해서는 사용할 컴포넌트에서 subscribe 메서드를 사용해 구독을 해야한다.

콜백을 이용해 값을 바꾸거나 사용할 수 있다.

- update : store의 값을 변경할 수 있으며 인자로 콜백을 받는다. => 변경된 값은 store의 값에 저장된다.

- get : store에 저장된 값을 가져온다.

- set : 새 값을 인자로 받으며 이 값을 store의 값에 업데이트한다.

update 와 set의 차이점

update는 새 값 대신 함수를 인수로 사용한다. 이 함수는 store의 현재 값을 인수로 사용하고 새 값을 반환한다.\
이렇게 하면 단순히 새 값으로 덮어쓰는 것 대신 현재 값을 늘리거나 중리는 등 더 복잡한 업데이트가 가능하다.

이 부분은 react의 useState가 안에서 콜백을 받을 때와 비슷하다.

### readable(initialValue, start?)

start는 선택 사항이며 처음 구독할때 호출할 기능을 지정할 수 있다.

이 값은 메서드의 이름과 같이 읽기 전용이며 update가 불가능하다.

### derived(stores:store[], fn:callBack)

다른 store를 기반으로 하는 파생 store를 생성한다.

파생된 store는 업데이트에 의존하는 store 중 하나가 업데이트 될때마다 값을 update 한다.

두번째 매개변수인 fn는 store의 현재 값을 수신하고 파생된 store에 대한 새 값을 리턴하는 함수다.

```javascript
import { readable, derived } from 'svelte/store';

const count = readable(0);
const doubleCount = derived([count], ($count) => $count * 2);

count.set(10);
console.log(doubleCount.get()); // 20
```

### subscribe(store, callback)

store가 인자로 전달되면 해당 store의 업데이트를 구독하고 업데이트가 이루어 질때 마다 콜백 함수가 호출된다.

```javascript
import { writable } from 'svelte/store';

const count = writable(0);

count.subscribe((value) => {
	console.log('Count has been updated to:', value);
});

count.set(5); // Console log: Count has been updated to: 5
```
