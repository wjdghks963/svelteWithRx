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

페이지 이동을 위한 태그를 사용할 때 `<a>` 대신 `<Link>`를 사용한다.

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
