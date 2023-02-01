<script>
	import { count, countSubject } from '../store';

	countSubject.subscribe((value) => count.set(value));

	const upup = () => {
		countSubject.next(countSubject.value + 1);
	};

	const down = () => {
		countSubject.next(countSubject.value - 1);
	};
</script>

<span>{$count}</span>
<button on:click={upup}>+</button>
<button on:click={down}>-</button>

<style>
</style>
