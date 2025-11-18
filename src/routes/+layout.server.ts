import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
// Ganti 'LayoutLoad' menjadi 'LayoutServerLoad'
import type { LayoutServerLoad } from './$types';

/**
 * Fungsi load untuk layout server.
 * Memastikan dependensi autentikasi Supabase dan mengambil sesi pengguna saat ini.
 * Mengembalikan objek berisi sesi, URL Supabase, dan kunci anon Supabase.
 *
 * @param depends Fungsi untuk mendeklarasikan dependensi data.
 * @param locals Objek lokal yang berisi fungsi getSession untuk mengambil sesi pengguna.
 * @returns Objek yang berisi session, supabaseUrl, dan supabaseKey.
 */
export const load: LayoutServerLoad = async ({ depends, locals }) => {
	depends('supabase:auth');

	// Panggil 'locals.getSession()' (INI SEKARANG BENAR)
	const session = await locals.getSession();

	return {
		session: session,
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY
	};
};
