<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type * as L from 'leaflet';

	let { data } = $props();

	let mapInstance = $state<L.Map | null>(null);
	let geoJsonLayer = $state<L.GeoJSON | null>(null);
	let isMapLoading = $state(true);
	let mapError = $state<string | null>(null);

	let LeafletModule: typeof L | null = null;

	// Gaya poligon
	const defaultStyle = {
		color: '#00008b',
		weight: 1,
		fillColor: '#add8e6',
		fillOpacity: 0.5,
		opacity: 1
	};

	const highlightStyle = {
		color: '#ff7800',
		weight: 3,
		fillColor: '#ffed4e',
		fillOpacity: 0.8,
		opacity: 1
	};

	const initializeMap = async () => {
		if (!browser || mapInstance) return;

		try {
			isMapLoading = true;
			mapError = null;

			if (!LeafletModule) {
				const leafletModule = await import('leaflet');
				LeafletModule = leafletModule.default || leafletModule;

				await import('leaflet/dist/leaflet.css');

				delete (LeafletModule.Icon.Default.prototype as any)._getIconUrl;
				LeafletModule.Icon.Default.mergeOptions({
					iconRetinaUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
					iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
				});
			}

			const map = LeafletModule.map('map').setView([20, 0], 2);

			LeafletModule.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			mapInstance = map;
			isMapLoading = false;
		} catch (error) {
			console.error('Error initializing map:', error);
			mapError = `Gagal menginisialisasi peta: ${error instanceof Error ? error.message : 'Unknown error'}`;
			isMapLoading = false;
		}
	};

	const drawGeoJSON = () => {
		if (!browser || !mapInstance || !LeafletModule || !data.geojson) return;

		try {
			if (geoJsonLayer) {
				mapInstance.removeLayer(geoJsonLayer);
			}

			const layer = LeafletModule.geoJSON(data.geojson, {
				style: defaultStyle,
				onEachFeature: (feature, layer) => {
					const countryName = feature.properties?.name;
					const iso3Code = feature.properties?.['ISO3166-1-Alpha-3'];

					if (countryName) {
						const popupContent = `
							<div class="text-center">
								<h3 class="font-bold text-lg mb-1">${countryName}</h3>
								${iso3Code ? `<p class="text-sm text-gray-600">Code: ${iso3Code}</p>` : ''}
							</div>
						`;
						layer.bindPopup(popupContent);
					}
				}
			});

			layer.addTo(mapInstance);
			geoJsonLayer = layer;
		} catch (error) {
			console.error('Error drawing GeoJSON:', error);
			mapError = `Gagal menggambar peta: ${error instanceof Error ? error.message : 'Unknown error'}`;
		}
	};

	const zoomToCountry = (countryName: string) => {
		if (!geoJsonLayer || !mapInstance) return;

		geoJsonLayer.eachLayer((layer: any) => {
			const feature = layer.feature;
			if (feature?.properties?.name === countryName) {
				mapInstance?.fitBounds(layer.getBounds(), {
					padding: [50, 50],
					maxZoom: 6
				});
				layer.openPopup();
			}
		});
	};

	onMount(() => {
		initializeMap();
	});

	$effect(() => {
		if (mapInstance && data.geojson && !isMapLoading) {
			drawGeoJSON();
		}
	});
</script>

<svelte:head>
	<title>Hexa Conservation - World Map</title>
</svelte:head>

<div class="flex h-screen w-screen bg-white text-gray-800">
	<aside class="flex h-full w-1/4 flex-col border-r border-gray-200 bg-gray-50 p-4 shadow-lg">
		<h1 class="mb-4 text-2xl font-bold text-blue-700">Hexa Countries</h1>

		<div class="flex grow flex-col overflow-hidden">
			<button
				type="button"
				class="mb-4 w-full rounded-md bg-green-600 px-4 py-2 text-white shadow-sm transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-400"
				disabled
			>
				Download as PDF (WIP)
			</button>

			<div class="mb-4">
				<input
					type="text"
					placeholder="Search countries..."
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="flex-1 overflow-y-auto rounded-md border border-gray-200 bg-white">
				{#if data.countries && data.countries.length === 0}
					<p class="p-4 text-center text-sm text-gray-500">Tidak ada negara ditemukan.</p>
				{:else if data.countries}
					{#each data.countries as country (country)}
						<button
							type="button"
							class="block w-full border-b border-gray-100 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
							onclick={() => zoomToCountry(country)}
						>
							{country}
						</button>
					{/each}
				{/if}
			</div>
		</div>
	</aside>

	<main class="relative h-full w-3/4">
		{#if data.error || mapError}
			<div class="flex h-full w-full items-center justify-center bg-red-100">
				<div class="text-center">
					<p class="mb-2 text-xl font-medium text-red-700">Gagal memuat peta</p>
					<p class="text-sm text-red-600">
						{data.error || mapError}
					</p>
					<button
						class="mt-4 rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
						onclick={() => window.location.reload()}
					>
						Refresh Halaman
					</button>
				</div>
			</div>
		{:else}
			{#if isMapLoading}
				<div class="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
					<div class="text-center">
						<div
							class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
						></div>
						<p class="text-gray-600">Memuat peta...</p>
					</div>
				</div>
			{/if}

			<div id="map" class="h-full w-full bg-gray-200" class:opacity-50={isMapLoading}></div>
		{/if}
	</main>
</div>
