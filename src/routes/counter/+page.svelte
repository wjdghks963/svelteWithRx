<script lang="ts">
	import { count } from '../../store';
	import Counter from './Counter.svelte';

	// $: reactive 선언 => 구독을 하고 있다는 뜻으로 할당된 변수의 값을 업데이트하는 반응문
	// $ 값이 변경될 경우 UI update
	// $count 값과 동일한 새로운 반응 값이 생성된다. $count 값이 변경될때 마다 countValue도 자동으로 업데이트
	// $count만 사용하면 나중에 스토어 값이 변경 되더라도 자동으로 업데이트 되지 않는다.
	$: countValue = $count;
</script>

<div class="counter">
	<strong>{countValue}</strong>
	<Counter />
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
