<script lang="ts">
	import { onMount } from 'svelte';

	// Auto-submit form on page load for better UX
	onMount(() => {
		const form = document.getElementById('logout-form');
		if (form) {
			form.submit();
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
	<div class="text-center">
		<div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-xl flex items-center justify-center mb-4">
			<svg class="h-8 w-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
			</svg>
		</div>
		<h2 class="text-2xl font-bold text-gray-800 mb-2">Signing Out...</h2>
		<p class="text-gray-600">Please wait while we sign you out securely.</p>

		<form id="logout-form" method="POST" action="/logout">
			<noscript>
				<div class="mt-6">
					<button
						type="submit"
						class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-teal-500 to-emerald-600 shadow-lg hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
					>
						Click to Sign Out
					</button>
				</div>
			</noscript>
		</form>
	</div>
</div>