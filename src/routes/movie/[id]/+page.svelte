<script lang="ts">
	export let data: { data: Moive.MovieDetail };
	const { data: movieData } = data;
</script>

<div class="container">
	<h1>{movieData.nameKO} / {movieData.nameEN}</h1>
	<div class="time">
		<span>상영시간 : {movieData.showTime}분</span>
		<span>{movieData.year}년 개봉</span>
	</div>
	<div class="genres">
		Genres :
		{#each movieData.genres as genre}
			<span class="genre">{genre.genreNm}</span>
		{/each}
	</div>
	<div class="nations">
		Nations :
		{#each movieData.nations as nation}
			<span class="nation">{nation.nationNm}</span>
		{/each}
	</div>
	<div class="actors">
		Actors :
		{#each movieData.actors as actor, index}
			{#if index !== movieData.actors.length - 1}
				<span class="actor">{actor}, </span>
			{:else}
				<span class="actor">{actor} </span>
			{/if}
			<span class="actor">{actor}</span>
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.time {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 23px;
	}
	.time span {
		margin: 0 20px;
	}

	.genres {
		padding: 20px 0;
		font-weight: 400;
		font-size: 24px;
	}
	.nations {
		padding: 20px 0;
		font-weight: 400;
		font-size: 24px;
	}
</style>
