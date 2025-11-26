<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    let { form }: { form: ActionData } = $props();

    let files = $state<FileList | null>(null);
    let isLoading = $state(false);

    $effect(() => {
        if (files) {
            console.log(files);

            for (const file of files) {
                console.log(`${file.name}: ${file.size} bytes`);
            }
        }
    });
</script>

<div class="flex min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-100">
    <main class="container mx-auto p-4 sm:p-6 lg:p-8">
        <!-- Header -->
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-3xl font-bold text-brand-gradient bg-clip-text text-transparent">
                    Geo Projects Hexa Conservation Indonesia
                </h1>
                <p class="mt-1 text-gray-600">Offline Test | 25 November 2025</p>
            </div>
            <a
                href="/map"
                class="mt-4 sm:mt-0 inline-flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50"
            >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6m6 0v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z"
                    ></path>
                </svg>
                <span>Back to Map</span>
            </a>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <!-- Kolom Kiri: Form Upload -->
            <div class="lg:col-span-1">
                <div class="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm border border-white/20">
                    <h2 class="text-lg font-semibold text-gray-800">New Buffer Project</h2>
                    <p class="mb-6 text-sm text-gray-500">Upload a GeoJSON file to start.</p>

                    <form
                        method="POST"
                        enctype="multipart/form-data"
                        class="space-y-4"
                        use:enhance={() => {
                            isLoading = true;
                            return async ({ update }) => {
                                await update();
                                isLoading = false;
                            };
                        }}
                    >
                        <div>
                            <label for="geojsonFile" class="block text-sm font-medium text-gray-700"
                                >GeoJSON File</label
                            >
                            <div class="mt-1">
                                <input
                                    accept=".geojson,application/geo+json"
                                    bind:files
                                    id="geojsonFile"
                                    name="geojsonFile"
                                    type="file"
                                    required
                                    class="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-teal-700 hover:file:bg-teal-100 focus:outline-none"
                                />
                                {#if files && files.length > 0}
                                    <p class="mt-2 text-xs text-gray-500">Selected: {files[0].name}</p>
                                {/if}
                            </div>
                        </div>

                        <div>
                            <label for="buffer_value" class="block text-sm font-medium text-gray-700"
                                >Buffer Value (meters)</label
                            >
                            <input
                                id="buffer_value"
                                name="buffer_value"
                                type="number"
                                required
                                placeholder="e.g., 1000"
                                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            class="flex w-full items-center justify-center rounded-xl bg-linear-to-r from-teal-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {#if isLoading}
                                <svg
                                    class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            {:else}
                                <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    ></path>
                                </svg>
                                Upload & Buffer
                            {/if}
                        </button>
                    </form>

                    <!-- Feedback Messages -->
                    {#if form?.success}
                        <div class="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-800 border border-green-200">
                            <p>{form.message}</p>
                        </div>
                    {/if}
                    {#if form?.message && !form.success}
                        <div class="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-800 border border-red-200">
                            <p>{form.message}</p>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Kolom Kanan: Daftar Proyek -->
            <div class="lg:col-span-2">
                <div class="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm border border-white/20">
                    <h2 class="text-lg font-semibold text-gray-800">Project List</h2>
                    <p class="mb-6 text-sm text-gray-500">Your past and present projects.</p>

                    <!-- Placeholder untuk daftar proyek -->
                    <div
                        class="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50"
                    >
                        <div class="text-center">
                            <svg
                                class="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                ></path>
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                            <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
