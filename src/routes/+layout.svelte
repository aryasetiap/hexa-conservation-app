<!--
	+layout.svelte
	Komponen layout utama untuk aplikasi Svelte yang mengelola autentikasi menggunakan Supabase.
	
	Fitur:
	- Menginisialisasi klien Supabase dengan URL dan Key dari data props.
	- Memantau perubahan status autentikasi pengguna (login/logout) melalui Supabase.
	- Jika terjadi perubahan akses token, seluruh data aplikasi akan di-refresh menggunakan invalidateAll().
	- Mengimpor stylesheet global dari app.css.
	- Menyediakan slot untuk merender children dari layout ini.

	Catatan:
	- Pastikan data.session, data.supabaseUrl, dan data.supabaseKey tersedia pada props.
	- Subscription pada perubahan autentikasi akan dibersihkan saat komponen di-unmount.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import '../app.css';

	import {
		createClient,
		type AuthChangeEvent,
		type Session,
		type SupabaseClient
	} from '@supabase/supabase-js';

	let { data, children } = $props();

	let serverSession = data.session;

	let supabase = $state<SupabaseClient | null>(null);

	$effect(() => {
		serverSession = data.session;
	});

	onMount(() => {
		supabase = createClient(data.supabaseUrl, data.supabaseKey);

		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
			if (session?.access_token !== serverSession?.access_token) {
				invalidateAll();
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

{@render children()}
