<script lang="ts">
	import RouteTracker from '@components/RouteTracker.svelte';

	interface $$Props {
		gpxFiles: string[];
	}

	export let gpxFiles: string[];
</script>

<div class="absolute top-0 right-0 w-full xl:w-3/5 2xl:w-2/3 h-full -z-10">
	<div class="relative w-full h-full">
		<div class="sticky top-0 w-full h-screen">
			<RouteTracker class="w-full h-full opacity-0" {gpxFiles} />
		</div>
		<div id="map-overlay" class="absolute top-0 right-0 bottom-0 left-0 w-full h-full" />
	</div>
</div>
