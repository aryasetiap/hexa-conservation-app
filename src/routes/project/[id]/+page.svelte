<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import type { PageData } from './$types';
    import type * as L from 'leaflet';

    let { data }: { data: PageData } = $props();

    let mapContainer: HTMLElement;
    let mapInstance: L.Map | null = $state(null);
    let originalLayer: L.GeoJSON | null = $state(null);
    let bufferedLayer: L.GeoJSON | null = $state(null);

    let showOriginal = $state(true);
    let showBuffered = $state(true);

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString('en-GB', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
    }

    onMount(async () => {
        if (browser && data.project) {
            const L = (await import('leaflet')).default;
            await import('leaflet/dist/leaflet.css');

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
            });

            mapInstance = L.map(mapContainer);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance);

            if (data.project.original_geojson) {
                originalLayer = L.geoJSON(data.project.original_geojson as any, {
                    style: { color: '#3b82f6', weight: 2, opacity: 0.8, fillOpacity: 0.2 }
                }).addTo(mapInstance);
            }

            if (data.project.processed_geojson) {
                bufferedLayer = L.geoJSON(data.project.processed_geojson as any, {
                    style: { color: '#10b981', weight: 2, opacity: 0.9, fillOpacity: 0.3 }
                }).addTo(mapInstance);
            }

            const bounds = new L.FeatureGroup([originalLayer, bufferedLayer].filter(Boolean) as L.Layer[]).getBounds();
            if (bounds.isValid()) {
                mapInstance.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    });

    onDestroy(() => {
        mapInstance?.remove();
    });

    $effect(() => {
        if (mapInstance && originalLayer) {
            if (showOriginal && !mapInstance.hasLayer(originalLayer)) {
                mapInstance.addLayer(originalLayer);
            } else if (!showOriginal && mapInstance.hasLayer(originalLayer)) {
                mapInstance.removeLayer(originalLayer);
            }
        }
    });

    $effect(() => {
        if (mapInstance && bufferedLayer) {
            if (showBuffered && !mapInstance.hasLayer(bufferedLayer)) {
                mapInstance.addLayer(bufferedLayer);
            } else if (!showBuffered && mapInstance.hasLayer(bufferedLayer)) {
                mapInstance.removeLayer(bufferedLayer);
            }
        }
    });
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div class="container mx-auto flex items-center justify-between p-4">
            <div>
                <h1 class="text-xl font-bold text-gray-800">{data.project?.project_name}</h1>
                <p class="text-sm text-gray-500">
                    Created on: {formatDate(data.project?.created_at ?? '')}
                </p>
            </div>
            <a
                href="/project"
                class="inline-flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                <span>Back to Projects</span>
            </a>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 relative">
        <div
            bind:this={mapContainer}
            class="h-full w-full pointer-events-none"
            style="min-height: calc(100vh - 85px);"
        ></div>

        <!-- Layer Control Panel -->
        <div
            class="absolute top-4 right-4 z-1000 w-64 rounded-2xl bg-white/80 p-4 shadow-lg backdrop-blur-sm border border-white/20"
        >
            <h3 class="font-semibold text-gray-800 mb-3">Layer Controls</h3>
            <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" bind:checked={showOriginal} class="h-5 w-5 rounded text-blue-500 focus:ring-blue-500" />
                    <span class="text-sm font-medium text-gray-700">Original Polygon</span>
                    <div class="ml-auto h-4 w-4 rounded-md border border-blue-600 bg-blue-500/30"></div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" bind:checked={showBuffered} class="h-5 w-5 rounded text-emerald-500 focus:ring-emerald-500" />
                    <span class="text-sm font-medium text-gray-700">Buffered Polygon</span>
                    <div class="ml-auto h-4 w-4 rounded-md border border-emerald-600 bg-emerald-500/40"></div>
                </label>
            </div>
        </div>
    </main>
</div>