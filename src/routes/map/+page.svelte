<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type * as L from 'leaflet';

	import { goto } from '$app/navigation';
	import { createClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/database.types';

	let { data } = $props();

	let mapInstance = $state<L.Map | null>(null);
	let geoJsonLayer = $state<L.GeoJSON | null>(null);
	let selectedCountries = $state(new Set<string>());
	let countryLayers = $state<{ [key: string]: L.Layer }>({});

	const defaultStyle = {
		color: '#00008b',
		weight: 1,
		fillColor: '#add8e6',
		fillOpacity: 0.5
	};
	const highlightStyle = {
		color: '#ff7800',
		weight: 3,
		fillColor: '#ffed4e',
		fillOpacity: 0.7
	};

	async function handleLogout() {
		const supabase = createClient<Database>(data.supabaseUrl, data.supabaseKey);
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		}
		goto('/login');
	}

	function toggleCountry(countryName: string) {
		const newSet = new Set(selectedCountries);
		if (newSet.has(countryName)) {
			newSet.delete(countryName);
		} else {
			newSet.add(countryName);
		}
		selectedCountries = newSet;
	}

	onMount(() => {
		let L: typeof import('leaflet');
		const initMap = async () => {
			try {
				const leafletModule = await import('leaflet');
				L = leafletModule.default || leafletModule;
				await import('leaflet/dist/leaflet.css');

				delete (L.Icon.Default.prototype as any)._getIconUrl;
				L.Icon.Default.mergeOptions({
					iconRetinaUrl:
						'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
					iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
					shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
				});

				if (mapInstance) return;
				const map = L.map('map').setView([20, 0], 2);
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);
				mapInstance = map;
			} catch (e) {
				console.error('Gagal memuat atau inisialisasi Leaflet:', e);
			}
		};
		initMap();
	});

	$effect(() => {
		if (browser && mapInstance && data.geojson) {
			import('leaflet').then((L) => {
				if (geoJsonLayer) {
					// Kita juga harus cek di sini
					if (mapInstance) {
						mapInstance.removeLayer(geoJsonLayer);
					}
				}

				countryLayers = {};

				const layer = L.geoJSON(data.geojson, {
					style: defaultStyle,
					onEachFeature: (feature, layer) => {
						const countryName = feature.properties?.name;

						if (countryName) {
							layer.bindPopup(countryName);

							const existingLayers = countryLayers;
							existingLayers[countryName] = layer;
							countryLayers = existingLayers;

							layer.on('click', () => {
								toggleCountry(countryName);
							});
						}
					}
				});

				if (mapInstance) {
					layer.addTo(mapInstance);
				}

				geoJsonLayer = layer;
			});
		}
	});

	$effect(() => {
		if (Object.keys(countryLayers).length === 0) return;

		for (const countryName in countryLayers) {
			const layer = countryLayers[countryName] as L.Path;
			if (layer && typeof layer.setStyle === 'function') {
				if (selectedCountries.has(countryName)) {
					layer.setStyle(highlightStyle);
					layer.bringToFront();
				} else {
					layer.setStyle(defaultStyle);
				}
			}
		}
	});
</script>

<div class="flex h-screen w-screen bg-white text-gray-800">
	<aside class="flex h-full w-1/4 flex-col border-r border-gray-200 bg-gray-50 p-4 shadow-lg">
		<h1 class="mb-4 text-2xl font-bold text-blue-700">Hexa Countries</h1>

		<button
			type="button"
			class="mb-4 w-full rounded-md bg-red-600 px-4 py-2 text-white shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
			onclick={handleLogout}
		>
			Logout
		</button>

		<div class="flex grow flex-col overflow-hidden">
			<button
				type="button"
				class="mb-4 w-full rounded-md bg-green-600 px-4 py-2 text-white shadow-sm transition hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
			>
				Download as PDF (WIP)
			</button>

			<div class="flex-1 overflow-y-auto rounded-md border border-gray-200 bg-white">
				{#if data.countries && data.countries.length === 0}
					<p class="p-4 text-center text-sm text-gray-500">Tidak ada negara ditemukan.</p>
				{/if}
				{#each data.countries as country (country)}
					<button
						type="button"
						class="block w-full border-b border-gray-100 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 focus:outline-none"
						class:bg-blue-100={selectedCountries.has(country)}
						class:font-bold={selectedCountries.has(country)}
						onclick={() => toggleCountry(country)}
					>
						{country}
					</button>
				{/each}
			</div>
		</div>
	</aside>

	<main class="h-full w-3/4">
		{#if data.error}
			<div class="flex h-full w-full items-center justify-center bg-red-100">
				<p class="text-xl font-medium text-red-700">
					Gagal memuat data peta: {data.error}
				</p>
			</div>
		{:else}
			<div id="map" class="h-full w-full bg-gray-200"></div>
		{/if}
	</main>
</div>
