<script lang="ts">
	import { countSubject } from '../store';
	import CountBtn from './Counter.svelte';
</script>

<div class="counter">
	<strong>{$countSubject}</strong>
	<CountBtn />
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100vw;
	}
	strong {
		font-size: 40px;
		font-weight: bold;
		text-align: center;
	}
</style>
