<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import '../app.css'; // Import CSS global Tailwind

	// Impor 'createClient' dan Tipe dari library inti
	import {
		createClient,
		type AuthChangeEvent,
		type Session,
		type SupabaseClient
	} from '@supabase/supabase-js';

	// Impor tipe Database kita
	import type { Database } from '$lib/database.types';

	// Terima 'children' sebagai prop untuk Svelte 5
	let { data, children } = $props();

	// Menyimpan sesi dari server
	let serverSession = data.session;

	// PERBAIKAN: Gunakan Tipe Generik <Database>
	// Ini memberi tahu $state bahwa 'supabase' akan menjadi client
	// yang sudah di-type atau null.
	let supabase = $state<SupabaseClient<Database> | null>(null);

	// Menyinkronkan serverSession lokal dengan data terbaru dari server
	$effect(() => {
		serverSession = data.session;
	});

	// 'onMount' HANYA berjalan di BROWSER.
	onMount(() => {
		// PERBAIKAN: Gunakan Tipe Generik <Database> saat membuat client
		supabase = createClient<Database>(data.supabaseUrl, data.supabaseKey);

		// Sekarang 'supabase' sudah ada, kita bisa atur listener
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
			if (session?.access_token !== serverSession?.access_token) {
				invalidateAll(); // Muat ulang data jika sesi berubah
			}
		});

		// Membersihkan listener saat komponen dihancurkan
		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<!-- Gunakan sintaks Svelte 5 {@render children()} -->
{@render children()}
