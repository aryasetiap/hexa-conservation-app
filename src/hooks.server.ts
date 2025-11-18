import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

/**
 * Fungsi utama hooks SvelteKit untuk menginisialisasi Supabase client pada setiap request.
 * Menyimpan Supabase client dan helper getSession di event.locals agar dapat diakses di server.
 */
/**
 * Middleware untuk menangani setiap request pada aplikasi SvelteKit.
 *
 * - Membuat instance Supabase client dan menyimpannya di `event.locals.supabase`.
 * - Menyediakan fungsi `getSession` untuk mendapatkan sesi autentikasi pengguna.
 * - Memfilter header response yang diserialisasi hanya pada 'content-range'.
 *
 * @param event - Objek event dari SvelteKit yang berisi informasi request.
 * @param resolve - Fungsi untuk melanjutkan proses request.
 * @returns Response hasil dari resolve dengan filter header tertentu.
 */
export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
