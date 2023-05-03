<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { Map, LatLng, Marker, LatLngBoundsExpression } from 'leaflet';
	import { latestIndex, observedIndexes } from 'src/stores/routeStore';
	import { fetchApi } from 'src/lib/fetchApi';
	import { resizeObserver } from 'src/lib/actions/resizeObserver';

	interface $$Props {
		class: string;
		gpxFiles: string[];
	}

	type FeatureProperties = GeoJSON.GeoJsonProperties & {
		coordinateProperties: {
			times: string[];
		};
	};

	type Coordinate = {
		lat: number;
		lng: number;
		alt: number;
		timestamp: string;
	};

	type Data = {
		tracks: GeoJSON.FeatureCollection[];
		coordinates: Coordinate[];
	};

	let className: string;
	export { className as class };

	export let gpxFiles: string[];

	async function fetchData(): Promise<Data> {
		let data: Data = {
			tracks: [],
			coordinates: [],
		};

		// Populate data.tracks
		for (let file of gpxFiles) {
			const filename = file.replace('/src/assets/gpx/', '').replace('.gpx', '');
			await fetchApi<GeoJSON.FeatureCollection>(`/api/${filename}.geojson`).then((response) => {
				data.tracks.push(response);
			});
		}

		// Populate data.coordinates
		for (let track of data.tracks) {
			const feature = track.features[0] as GeoJSON.Feature<GeoJSON.LineString, FeatureProperties>;
			for (let i = 0; i < feature.geometry.coordinates.length - 1; i++) {
				const times = feature.properties.coordinateProperties.times as string[];
				const lat: Coordinate['lat'] = feature.geometry.coordinates[i][1];
				const lng: Coordinate['lng'] = feature.geometry.coordinates[i][0];
				const alt: Coordinate['alt'] = feature.geometry.coordinates[i][3];
				const timestamp: Coordinate['timestamp'] = times[i];
				data.coordinates.push({
					lat,
					lng,
					alt,
					timestamp,
				});
			}
		}

		coordinates = data.coordinates;

		bounds = L.latLngBounds(
			data.coordinates.map(({ lat, lng }) => {
				return [lat, lng];
			})
		);

		return data;
	}

	/** Leaflet.js instance */
	let map: Map | null;

	/** The marker showing rider position */
	let marker: Marker;
	let bounds: LatLngBoundsExpression;
	let mapIsReady: boolean = false;

	/** Attaches a Leaflet map to a div element and returns it */
	function createMap(el: HTMLDivElement, initialPosition: LatLng): Map {
		let map = L.map(el, {
			preferCanvas: false,

			// Disable ui elements
			attributionControl: false,
			zoomControl: false,

			// Disable interactivity
			// dragging: false,
			// tap: false,
			// scrollWheelZoom: false,
			// boxZoom: false,
			// doubleClickZoom: false,
			// inertia: true,
		}).fitBounds(bounds);
		L.tileLayer(
			// `https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${import.meta.env.PUBLIC_THUNDERFOREST_API_KEY}`,
			'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
			{
				maxZoom: 15,
			}
		).addTo(map);

		return map;
	}

	function handleMapResize(): void {
		if (map) {
			// Invalidate map size, redrawing tiles if needed
			map.invalidateSize();

			// Rescale map to fit bounds after resize
			map.fitBounds(bounds);
		}
	}

	function mapBuilder(
		el: HTMLDivElement,
		data: Data
	): {
		destroy: () => void;
	} {
		async () => {
			import('leaflet/dist/leaflet.css');
		};
		const initialPosition: LatLng = L.latLng(data.coordinates[0].lat, data.coordinates[0].lng, data.coordinates[0].alt);

		map = createMap(el, initialPosition);

		marker = L.marker(initialPosition, {
			icon: new L.DivIcon({
				html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
				className: 'marker',
				iconSize: [32, 32],
				iconAnchor: [16, 32],
			}),
		}).addTo(map);
		L.geoJSON(data.tracks).addTo(map);
		map.whenReady(() => (mapIsReady = true));

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

	const promise: Promise<Data> = fetchData();
	let coordinates: Coordinate[];

	onMount(() => {
		latestIndex.set(0);

		// Cleanup state on destroy
		return () => {
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
			if (currentIndex === coordinates.length - 1) {
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

		marker?.setLatLng({ lat: coordinates[currentIndex].lat, lng: coordinates[currentIndex].lng });
		map?.setView({ lat: coordinates[currentIndex].lat, lng: coordinates[currentIndex].lng }, 12);
	}

	function startAnimation(to: number) {
		// Handle invalid params
		if (to > coordinates.length - 1) {
			throw new Error('to cannot be greater than the length of coordinates');
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
		}, 1000 / 120);
	}

	function endAnimation(): void {
		clearInterval(timer);
	}

	latestIndex.listen((val) => {
		if (map) {
			startAnimation(val);
		}
	});

	const dateFormat = new Intl.DateTimeFormat('en', {
		timeStyle: 'short',
		dateStyle: 'medium',
	});
</script>

{#await promise then data}
	<div
		id="map"
		class={className}
		class:opacity-100={mapIsReady === true}
		use:mapBuilder={data}
		use:resizeObserver={handleMapResize}
	>
		<div class="absolute right-0 bottom-0 p-4 z-[1000]">
			<div class="bg-black text-white px-4 py-2">
				{$latestIndex}
				{dateFormat.format(new Date(data.coordinates[currentIndex].timestamp))}
			</div>
		</div>
	</div>
{/await}
