<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type * as L from 'leaflet';

	// Removed unused imports - logout now handled via server action

	import type { jsPDF } from 'jspdf';

	let { data } = $props();

	let mapInstance = $state<L.Map | null>(null);
	let geoJsonLayer = $state<L.GeoJSON | null>(null);
	let selectedCountries = $state(new Set<string>());
	let countryLayers = $state<{ [key: string]: L.Layer }>({});

	let isGeneratingPdf = $state(false);

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

	function handleLogout() {
		// Navigate to logout page for proper server-side logout
		window.location.href = '/logout';
	}

	function gotoProject(){
		window.location.href = '/project';
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

	async function downloadPDF() {
		isGeneratingPdf = true;

		let doc: jsPDF | null = null;

		try {
			const { default: jsPDF } = await import('jspdf');

			doc = new jsPDF('p', 'mm', 'a4');

			const userEmail = data.session?.user?.email || 'Tidak diketahui';
			const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
			const allCountries = data.countries; // Sudah diurutkan dari +page.ts
			const selectedArray = Array.from(selectedCountries).sort();

			const leftMargin = 14;
			const pageTopMargin = 20;
			const pageBottomMargin = 283; // A4 (297mm) - margin 14mm
			const lineHeight = 7; // Ketinggian per baris
			let y = pageTopMargin; // Posisi Y saat ini

			doc.setFontSize(18);
			doc.text('Laporan Negara - Hexa Conservation', leftMargin, y);
			y += 10; // Pindah ke bawah

			doc.setFontSize(12);
			doc.text(`Email Pengguna: ${userEmail}`, leftMargin, y);
			y += lineHeight;
			doc.text(`Waktu Laporan: ${timestamp} WIB`, leftMargin, y);
			y += lineHeight;
			doc.text(`Jumlah Total Negara: ${allCountries.length}`, leftMargin, y);
			y += lineHeight;
			doc.text(`Jumlah Negara Dipilih: ${selectedArray.length}`, leftMargin, y);
			y += lineHeight * 2; // Beri spasi

			doc.setFontSize(14);
			doc.text('Daftar Negara Dipilih:', leftMargin, y);
			y += 10;
			doc.setFontSize(10);

			if (selectedArray.length === 0) {
				doc.text('(Tidak ada negara yang dipilih)', leftMargin, y);
				y += lineHeight;
			} else {
				for (const country of selectedArray) {
					if (y > pageBottomMargin) {
						doc.addPage();
						y = pageTopMargin;
						doc.setFontSize(10); // Set ulang font di halaman baru
					}
					doc.text(country, leftMargin, y);
					y += lineHeight;
				}
			}

			doc.addPage(); // Mulai di halaman baru
			y = pageTopMargin;
			doc.setFontSize(14);
			doc.text('Daftar Semua Negara:', leftMargin, y);
			y += 10;
			doc.setFontSize(10);

			for (const country of allCountries) {
				if (y > pageBottomMargin) {
					doc.addPage();
					y = pageTopMargin;
					doc.setFontSize(10); // Set ulang font di halaman baru
				}
				doc.text(country, leftMargin, y);
				y += lineHeight;
			}

			doc.save(`HexaConservation_Report_${Date.now()}.pdf`);
		} catch (e) {
			console.error('Gagal membuat PDF:', e);
		} finally {
			isGeneratingPdf = false;
		}
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
					if (mapInstance) mapInstance.removeLayer(geoJsonLayer);
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

<div class="flex h-screen w-screen bg-gray-50">
	<!-- Mobile Menu Toggle -->
	<button
		type="button"
		class="lg:hidden fixed top-4 left-4 z-50 h-10 w-10 rounded-xl bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
		onclick={() => {
			document.getElementById('sidebar')?.classList.remove('-translate-x-full');
			document.getElementById('overlay')?.classList.remove('opacity-0', 'pointer-events-none');
		}}
	>
		<svg class="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
		</svg>
	</button>

	<!-- Mobile Overlay -->
	<div
		class="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 opacity-0 pointer-events-none"
		onclick={() => {
			document.getElementById('sidebar')?.classList.add('-translate-x-full');
			document.getElementById('overlay')?.classList.add('opacity-0', 'pointer-events-none');
		}}
		id="overlay"
	></div>

	<!-- Sidebar -->
	<aside id="sidebar" class="fixed lg:relative lg:translate-x-0 -translate-x-full transition-transform duration-300 ease-in-out z-40 flex h-full w-80 max-w-[85vw] lg:max-w-none flex-col bg-white shadow-2xl border-r border-gray-100">
		<!-- Header Section -->
		<div class="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white">
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center space-x-3">
					<div class="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<div>
						<h1 class="text-xl font-bold">Hexa Conservation</h1>
						<p class="text-xs text-teal-100">Country Mapping System</p>
					</div>
				</div>
				<!-- Mobile Close Button -->
				<button
					type="button"
					class="lg:hidden h-8 w-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-white/30 focus:outline-none"
					onclick={() => {
						document.getElementById('sidebar')?.classList.add('-translate-x-full');
						document.getElementById('overlay')?.classList.add('opacity-0', 'pointer-events-none');
					}}
				>
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Stats Overview -->
			<div class="grid grid-cols-2 gap-3">
				<div class="bg-white/10 backdrop-blur-sm rounded-lg p-3">
					<p class="text-xs text-teal-100">Total Countries</p>
					<p class="text-lg font-bold">{data.countries?.length || 0}</p>
				</div>
				<div class="bg-white/10 backdrop-blur-sm rounded-lg p-3">
					<p class="text-xs text-teal-100">Selected</p>
					<p class="text-lg font-bold">{selectedCountries.size}</p>
				</div>
			</div>
			
			<!-- To Projects Page Button -->
			<button
				type="button"
				class="flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:outline-none"
				onclick={gotoProject}
			>
				<span>Go to Project</span>
			</button>
		</div>

		<!-- Controls Section -->
		<div class="p-4 border-b border-gray-100">
			<div class="space-y-3">
				<!-- Logout Button -->
				<button
					type="button"
					class="flex w-full items-center justify-center space-x-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 focus:outline-none"
					onclick={handleLogout}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
					</svg>
					<span>Sign Out</span>
				</button>

				<!-- PDF Download Button -->
				<button
					type="button"
					class="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500"
					onclick={downloadPDF}
					disabled={isGeneratingPdf || selectedCountries.size === 0}
				>
					{#if isGeneratingPdf}
						<svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Generating PDF...</span>
					{:else}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<span>Download PDF Report</span>
					{/if}
				</button>
			</div>
		</div>

		<!-- Countries List -->
		<div class="flex-1 overflow-hidden flex flex-col p-4">
			<div class="mb-3">
				<h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wider">Countries List</h2>
				<p class="text-xs text-gray-500 mt-1">Click to select countries on map</p>
			</div>

			<div class="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50/50 custom-scrollbar">
				{#if data.countries && data.countries.length === 0}
					<div class="flex flex-col items-center justify-center py-8 text-center">
						<svg class="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z"></path>
						</svg>
						<p class="text-sm font-medium text-gray-500">No countries found</p>
						<p class="text-xs text-gray-400 mt-1">Please check your connection</p>
					</div>
				{:else}
					{#each data.countries as country (country)}
						<button
							type="button"
							class="group flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left transition-all duration-200 hover:bg-white hover:shadow-sm focus:outline-none focus:bg-white"
							class:bg-gradient-to-r={selectedCountries.has(country)}
							class:from-teal-50={selectedCountries.has(country)}
							class:to-emerald-50={selectedCountries.has(country)}
							class:border-l-4={selectedCountries.has(country)}
							class:border-teal-500={selectedCountries.has(country)}
							onclick={() => toggleCountry(country)}
						>
							<span class="text-sm font-medium {selectedCountries.has(country) ? 'text-teal-700' : 'text-gray-700'} group-hover:text-gray-900">
								{country}
							</span>
							{#if selectedCountries.has(country)}
								<div class="flex items-center space-x-1">
									<div class="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></div>
									<svg class="h-4 w-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							{/if}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- User Info Footer -->
		<div class="border-t border-gray-100 bg-gray-50/80 p-4">
			<div class="flex items-center space-x-2">
				<div class="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
					<span class="text-xs font-semibold text-white">
						{data.session?.user?.email?.charAt(0).toUpperCase() || 'U'}
					</span>
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-xs font-medium text-gray-700 truncate">
						{data.session?.user?.email || 'Unknown User'}
					</p>
					<p class="text-xs text-gray-500">Online</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 relative overflow-hidden">
		{#if data.error}
			<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
				<div class="text-center max-w-md mx-auto p-8">
					<div class="mx-auto h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
						<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">Map Loading Failed</h3>
					<p class="text-sm text-gray-600">Unable to load map data: {data.error}</p>
					<button
						type="button"
						class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						onclick={() => window.location.reload()}
					>
						Retry
					</button>
				</div>
			</div>
		{:else}
			<div id="map" class="h-full w-full"></div>

			<!-- Map Controls Overlay -->
			<div class="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg border border-gray-200 p-2 space-y-2">
				<div class="text-xs font-medium text-gray-500 px-2 py-1">Map Controls</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded-full bg-teal-500"></div>
					<span class="text-xs text-gray-600">Selected</span>
				</div>
				<div class="flex items-center space-x-1">
					<div class="h-3 w-3 rounded-full bg-blue-200 border border-blue-600"></div>
					<span class="text-xs text-gray-600">Available</span>
				</div>
			</div>
		{/if}
	</main>
</div>
