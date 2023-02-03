<script lang="ts">
	export let movieDetail: Moive.MovieInfo;
</script>

<div class="container">
	<div class="title">
		<span>제목 : {movieDetail.nameKO}</span>
		/
		<span>제목(영문) : {movieDetail.nameEN}</span>
	</div>
	<div class="content">
		<span>개봉일 : {movieDetail.year}</span>
		<span>장르 : {movieDetail.genre}</span>
		<span>시간 : {movieDetail.time}</span>
	</div>
	<a href={`/movie/${movieDetail.code}`}>자세히 보기</a>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		background-color: azure;
		padding: 20px;
		border-radius: 10px;
		margin-bottom: 20px;
	}

	.title {
		font-size: 20px;
		font-weight: bold;
		padding-bottom: 10px;
	}

	.content {
		display: flex;
		flex-direction: column;
		font-size: 15px;
		font-weight: 600;
	}

	a {
		padding-top: 10px;
		color: black;
		text-decoration: underline;
	}
</style>
