<script lang="ts">
	import { latestIndex } from 'src/stores/routeStore';
	import IntersectionObserver from 'svelte-intersection-observer';

	interface $$Props {
		index: number;
	}

	export let index: number;

	let element: HTMLDivElement;
</script>

<IntersectionObserver
	{element}
	on:observe={(e) => {
		latestIndex.set(index);
	}}
>
	<div bind:this={element} />
</IntersectionObserver>
