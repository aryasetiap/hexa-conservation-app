<script lang="ts">
	let { data } = $props();

	const userEmail = data.session?.user?.email;
</script>

<div class="p-8">
	<h1 class="text-2xl font-bold">Selamat Datang di Halaman Peta</h1>
	<p class="mt-2">Anda berhasil login sebagai: <span class="font-medium">{userEmail}</span></p>
</div>
