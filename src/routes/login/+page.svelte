<script lang="ts">
	let { form } = $props();

	let email = $state(form?.email || '');
	let password = $state('');

	let loading = $state(false);

	function onFormSubmit() {
		loading = true;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
		<h1 class="mb-6 text-center text-2xl font-bold text-gray-800">Hexa Conservation</h1>

		<form method="POST" onsubmit={onFormSubmit}>
			<!-- Input Email -->
			<div class="mb-4">
				<label for="email" class="mb-2 block text-sm font-medium text-gray-700">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					class="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					placeholder="anda@example.com"
					required
					bind:value={email}
				/>
			</div>

			<div class="mb-6">
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					class="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					placeholder="••••••••"
					required
					bind:value={password}
				/>
			</div>

			{#if form?.error}
				<div class="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
					{form.error}
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-md bg-blue-600 p-3 text-white shadow-sm transition-colors
           hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none
           disabled:cursor-not-allowed disabled:bg-gray-400"
				>
					{#if loading}
						Sedang memuat...
					{:else}
						Login
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
