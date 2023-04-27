<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { Map, LatLngTuple, Marker } from 'leaflet';
	import { latestIndex } from 'src/stores/routeStore';

	interface $$Props {
		class: string;
		tracks: GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties>[];
	}

	let className: string;
	export { className as class };

	export let tracks: GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties>[] = [];

	/** An array of all track coordinates from all tracks */
	let allTrackCoordinates: GeoJSON.Position[] = [];
	for (let track of tracks) {
		allTrackCoordinates = allTrackCoordinates.concat(track.geometry.coordinates);
	}

	/** Leaflet.js instance */
	let map: Map | null;

	/** The div element for the Leaflet.js map */
	let mapEl: HTMLDivElement;

	/** The marker showing rider position */
	let marker: Marker;
	const initialView: LatLngTuple = [49.534048, -115.744507];
	const bounds = L.latLngBounds(
		allTrackCoordinates.map((c) => {
			return [c[1], c[0]];
		})
	);

	/** Attaches a Leaflet map to a div element and returns it */
	function createMap(el: HTMLDivElement): Map {
		let map = L.map(el, {
			preferCanvas: false,

			// Disable ui elements
			attributionControl: false,
			zoomControl: false,

			// Disable interactivity
			dragging: false,
			tap: false,
			scrollWheelZoom: false,
			boxZoom: false,
			doubleClickZoom: false,
			inertia: true,
		}).fitBounds(bounds);
		L.tileLayer(
			`https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${import.meta.env.PUBLIC_THUNDERFOREST_API_KEY}`,
			{
				maxZoom: 14,
			}
		).addTo(map);

		return map;
	}

	function mapBuilder(el: HTMLDivElement): {
		destroy: () => void;
	} {
		map = createMap(el);

		marker = L.marker(initialView, {
			icon: new L.DivIcon({
				html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
				className: 'marker',
				iconSize: [32, 32],
				iconAnchor: [16, 32],
			}),
		}).addTo(map);
		L.geoJSON(tracks).addTo(map);

		return {
			destroy: () => {
				// TODO: cleanup map elements on destroy
				if (map) {
					map.remove();
				}
				map = null;
			},
		};
	}

	onMount(() => {
		latestIndex.set(0);

		const resizeObserver = new ResizeObserver((entries) => {
			// Invalidate map size, redrawing tiles if needed
			map?.invalidateSize();

			// Rescale map to fit bounds after resize
			map?.fitBounds(bounds);
		});

		resizeObserver.observe(mapEl);

		// Cleanup state on destroy
		return () => {
			resizeObserver.unobserve(mapEl);
			latestIndex.set(0);
		};
	});

	enum Direction {
		Forwards,
		Backwards,
	}

	let currentIndex: number = 0;

	let timer: NodeJS.Timeout;

	function advanceAnimation(direction: Direction) {
		if (direction === Direction.Forwards) {
			if (currentIndex === allTrackCoordinates.length - 1) {
				endAnimation();
			} else {
				currentIndex++;
			}
		}

		if (direction === Direction.Backwards) {
			if (currentIndex === 0) {
				endAnimation();
			} else {
				currentIndex--;
			}
		}

		marker?.setLatLng({ lat: allTrackCoordinates[currentIndex][1], lng: allTrackCoordinates[currentIndex][0] });
		map?.setView({ lat: allTrackCoordinates[currentIndex][1], lng: allTrackCoordinates[currentIndex][0] }, 11);
	}

	function startAnimation(to: number) {
		// Handle invalid params
		if (to > allTrackCoordinates.length - 1) {
			throw new Error('to cannot be greater than the length of allTrackCoordinates');
		}

		// Handle animation in progress
		endAnimation();

		// Set animation direction
		let direction: Direction;

		if (currentIndex > to) {
			direction = Direction.Backwards;
		} else {
			direction = Direction.Forwards;
		}

		timer = setInterval(() => {
			if (currentIndex === to) {
				endAnimation();
			} else {
				advanceAnimation(direction);
			}
		}, 1000 / 60);
	}

	function endAnimation(): void {
		clearInterval(timer);
	}

	latestIndex.listen((val) => {
		startAnimation(val);
	});

	let window = {
		w: 0,
		h: 0,
	};

	$: {
	}
</script>

<div id="map" class={className} bind:this={mapEl} use:mapBuilder />
