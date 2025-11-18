<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import '../app.css'; // Import CSS global Tailwind

	import {
		createClient,
		type AuthChangeEvent,
		type Session,
		type SupabaseClient
	} from '@supabase/supabase-js';

	import type { Database } from '$lib/database.types';

	let { data, children } = $props();

	let serverSession = data.session;

	let supabase = $state<SupabaseClient<Database> | null>(null);

	$effect(() => {
		serverSession = data.session;
	});

	onMount(() => {
		supabase = createClient<Database>(data.supabaseUrl, data.supabaseKey);

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
