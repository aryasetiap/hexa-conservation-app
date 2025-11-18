<script lang="ts">
	// Import 'onMount' dari Svelte. Ini adalah kunci kita.
	// 'onMount' hanya berjalan di sisi BROWSER setelah HTML dimuat.
	import { onMount } from 'svelte';

	// Import Tipe Leaflet (yang kita instal dengan @types/leaflet)
	// Ini hanya untuk TypeScript, tidak memuat library-nya
	import type * as L from 'leaflet';

	// Terima 'data' (yang berisi sesi) dari +layout.server.ts
	// Kita mungkin tidak menggunakannya di sini, tapi data tersedia
	let { data } = $props();

	// Gunakan Svelte 5 Rune ($state) untuk menyimpan 'instance' peta
	// Ini berguna agar kita bisa mengakses peta dari fungsi lain nanti
	let mapInstance = $state<L.Map | null>(null);

	// 'onMount' berjalan setelah komponen dipasang ke DOM (hanya di browser)
	onMount(() => {
		// Variabel untuk menyimpan objek Leaflet utama (L)
		let L: typeof import('leaflet');

		// Buat fungsi 'async' untuk memuat Leaflet
		const initMap = async () => {
			try {
				// 1. Muat (import) library Leaflet secara dinamis
				// 'await import()' memastikan ini hanya terjadi di browser
				const leafletModule = await import('leaflet');
				L = leafletModule.default || leafletModule;

				// 2. Muat (import) CSS Leaflet secara dinamis
				// Tanpa ini, peta akan rusak (tidak ada tile, kontrol aneh)
				await import('leaflet/dist/leaflet.css');

				// 3. Cek jika peta sudah diinisialisasi
				// (berguna untuk Svelte 'hot module reload' agar tidak duplikat)
				if (mapInstance) {
					return;
				}

				// 4. Inisialisasi Peta
				// 'L.map('map')' mencari elemen dengan <div id="map">
				// '.setView([0, 0], 2)' atur view ke [lat, lng] dan zoom
				const map = L.map('map').setView([0, 0], 2);

				// 5. Tambahkan Tile Layer (gambar peta)
				// Kita gunakan OpenStreetMap (gratis)
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);

				// 6. Simpan instance peta ke $state kita
				mapInstance = map;
			} catch (e) {
				// Tangkap error jika gagal memuat Leaflet
				console.error('Gagal memuat atau inisialisasi Leaflet:', e);
			}
		};

		// Panggil fungsi inisialisasi peta
		initMap();
	});
</script>

<!-- 
  Struktur Tata Letak (Layout) Halaman Peta
  Kita gunakan Flexbox untuk membagi layar 
-->
<div class="flex h-screen w-screen bg-white text-gray-800">
	<!-- 
    KOLOM 1: Sidebar (w-1/4)
  -->
	<aside class="flex h-full w-1/4 flex-col border-r border-gray-200 bg-gray-50 p-4 shadow-lg">
		<h1 class="mb-4 text-2xl font-bold text-blue-700">Hexa Countries</h1>

		<!-- 
      Placeholder untuk Tahap 5 & 6
    -->
		<!-- PERBAIKAN 1: 'flex-grow' diubah menjadi 'grow' (saran Tailwind) -->
		<div class="grow rounded-md border border-dashed border-gray-300 bg-gray-100 p-4">
			<p class="text-center text-sm text-gray-500">
				(Daftar negara akan muncul di sini di Tahap 5)
			</p>
		</div>
	</aside>

	<!-- 
    KOLOM 2: Kontainer Peta (w-3/4)
  -->
	<main class="h-full w-3/4">
		<!-- 
      Elemen Peta WAJIB:
      - 'id="map"' (agar Leaflet 'L.map('map')' bisa menemukannya)
      - 'h-full w-full' (WAJIB punya tinggi dan lebar pasti)
    -->
		<!-- PERBAIKAN 2: Menggunakan tag penutup </div>, bukan self-closing /> (saran Svelte) -->
		<div id="map" class="h-full w-full bg-gray-200"></div>
	</main>
</div>
