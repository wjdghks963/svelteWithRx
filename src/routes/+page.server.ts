import { fromFetch } from 'rxjs/fetch';
import { switchMap, of, catchError, map } from 'rxjs';
import dotenv from 'dotenv';
import { error } from '@sveltejs/kit';
dotenv.config();

const apiKey = process.env.MOVIE_KEY;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const data$ = fromFetch(
		`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList?key=${apiKey}`
	).pipe(
		switchMap((response) => {
			if (response.ok) {
				// OK 면 데이터 받을 것을 json()
				return response.json();
			} else {
				// server는 client에서 다른 것을 try할 수 있게끔 status를 반환한다.
				throw error(404, 'Not found');
				return of({ error: true, message: `Error ${response.status}` });
			}
		}),
		catchError((err) => {
			// 네트워크나 다른 에러가 발생했고 에러 처리 하는 곳
			console.error(err);
			throw error(404, 'Not found');
			return of({ error: true, message: err.message });
		}),
		map((data) => {
			return data.movieListResult.movieList;
		})
	);

	const data = await data$.toPromise();
	return { data };
}
