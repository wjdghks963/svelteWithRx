<script lang="ts">
	import Post from '../components/Post.svelte';

	/** @type {import('./$types').PageData} */
	export let data: { data: Moive.MovieInfo[] };
</script>

<div>
	{#each data.data as movieDetail}
		<Post {movieDetail} />
	{/each}
</div>
