<script lang="ts">
	let { form } = $props();

	let email = $state(form?.email || '');
	let password = $state('');

	let loading = $state(false);

	function onFormSubmit() {
		loading = true;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-100">
	<!-- Background Pattern -->
	<div class="fixed inset-0 opacity-10">
		<div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2314b8a6\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
	</div>

	<div class="relative z-10 w-full max-w-md">
		<!-- Logo/Branding Section -->
		<div class="mb-8 text-center">
			<div class="mx-auto mb-4 h-16 w-16 rounded-2xl bg-linear-to-br from-teal-500 to-emerald-600 shadow-xl flex items-center justify-center">
				<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
			</div>
			<h1 class="text-3xl font-bold bg-linear-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
				Hexa Conservation
			</h1>
			<p class="mt-2 text-sm font-medium text-gray-600">Technical Test Platform</p>
		</div>

		<!-- Login Card -->
		<div class="overflow-hidden rounded-2xl bg-white/80 shadow-2xl backdrop-blur-sm border border-white/20">
			<div class="bg-linear-to-br from-teal-500 to-emerald-600 p-6 text-white">
				<h2 class="text-xl font-semibold">Welcome Back</h2>
				<p class="mt-1 text-sm text-teal-50">Sign in to access the country mapping system</p>
			</div>

			<div class="p-8">
				<form method="POST" onsubmit={onFormSubmit} class="space-y-6">
					<!-- Email Input -->
					<div>
						<label for="email" class="mb-2 block text-sm font-semibold text-gray-700">
							Email Address
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
								</svg>
							</div>
							<input
								type="email"
								id="email"
								name="email"
								class="block w-full rounded-lg border border-gray-200 pl-10 pr-3 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 focus:outline-none"
								placeholder="your.email@example.com"
								required
								bind:value={email}
							/>
						</div>
					</div>

					<!-- Password Input -->
					<div>
						<label for="password" class="mb-2 block text-sm font-semibold text-gray-700">
							Password
						</label>
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
								</svg>
							</div>
							<input
								type="password"
								id="password"
								name="password"
								class="block w-full rounded-lg border border-gray-200 pl-10 pr-3 py-3 text-sm placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 focus:outline-none"
								placeholder="••••••••"
								required
								bind:value={password}
							/>
						</div>
					</div>

					<!-- Error Message -->
					{#if form?.error}
						<div class="rounded-xl bg-red-50 border border-red-200 p-4">
							<div class="flex items-center">
								<svg class="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<p class="text-sm font-medium text-red-800">{form.error}</p>
							</div>
						</div>
					{/if}

					<!-- Submit Button -->
					<div>
						<button
							type="submit"
							disabled={loading}
							class="relative flex w-full justify-center rounded-xl bg-linear-to-r from-teal-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-teal-600 hover:to-emerald-700 focus:ring-4 focus:ring-teal-500 focus:ring-opacity-30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500"
						>
							{#if loading}
								<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Signing in...
							{:else}
								Sign In
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Footer -->
		<div class="mt-8 text-center">
			<p class="text-xs text-gray-500">
				© 2025 Hexa Conservation Indonesia. All rights reserved.
			</p>
		</div>
	</div>
</div>
