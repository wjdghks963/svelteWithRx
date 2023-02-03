<script lang="ts">
	import { countSubject } from '../../store';

	const up = () => {
		countSubject.next(countSubject.value + 1);
	};

	const down = () => {
		countSubject.next(countSubject.value - 1);
	};
</script>

<div class="counter">
	<button on:click={up} aria-label="Decrease the counter by one"> + </button>
	<button on:click={down} aria-label="Increase the counter by one"> - </button>
</div>

<style>
	.counter {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
		justify-content: center;
	}

	.counter button {
		width: 2em;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
		font-size: 2rem;
	}
</style>
