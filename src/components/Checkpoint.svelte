<script lang="ts">
	import { inview } from 'svelte-inview';
	import type { Options } from 'svelte-inview';
	import { addToObservedIndexes, latestIndex, removeFromObservedIndexes } from 'src/stores/routeStore';

	interface $$Props {
		index: number;
	}

	export let index: number;

	const options: Options = {
		rootMargin: '-45% 0% -45% 0%',
	};

	let isInView: boolean;
</script>

<div use:inview={options} on:inview_enter={() => latestIndex.set(index)}>
	<slot />
</div>
