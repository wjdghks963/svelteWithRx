import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError, map } from 'rxjs';
import { error } from '@sveltejs/kit';

import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.MOVIE_KEY;

export async function load({ params }: { params: { id: string } }) {
	const data$ = fromFetch(
		`http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo?key=${apiKey}&movieCd=${params.id}`
	).pipe(
		switchMap((response) => {
			if (response.ok) {
				// OK 면 데이터 받을 것을 json()
				return response.json();
			} else {
				// server는 client에서 다른 것을 try할 수 있게끔 status를 반환한다.
				throw error(404, 'Not found');
			}
		}),
		catchError((err) => {
			// 네트워크나 다른 에러가 발생했고 에러 처리 하는 곳
			console.error(err);
			throw error(404, 'Not found');
		}),
		map((data) => {
			const movie = data.movieInfoResult.movieInfo;
			return {
				nameKO: movie.movieNm,
				nameEN: movie.movieNmEn,
				showTime: movie.showTm,
				year: movie.prdtYear,
				nations: movie.nations,
				genres: movie.genres,
				actors: movie.actors.map((actor) => actor.peopleNm)
			};
		})
	);

	data$.subscribe({
		next: (data) => console.log(data)
	});

	const data = await data$.toPromise();
	return { data };
}
