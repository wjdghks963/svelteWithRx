// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	namespace Moive {
		interface MovieInfo {
			year: string;
			nameKO: string;
			nameEN: string;
			time: string;
			genre: string;
			code: string;
		}

		interface MovieDetail {
			nameKO: string;
			nameEN: string;
			showTime: string;
			year: string;
			nations: [{ nationNm: string }];
			genres: [{ genreNm: string }];
			actors: string[];
		}
	}
}

export {};
