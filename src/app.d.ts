import type { Session } from '@supabase/supabase-js';
import type { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

/**
 * Namespace global untuk tipe-tipe khusus aplikasi.
 */
declare global {
	namespace App {
		/**
		 * Interface untuk data lokal pada setiap request.
		 *
		 * @property supabase - Instance Supabase yang dihasilkan oleh fungsi `createSupabaseServerClient`.
		 * @property getSession - Fungsi helper untuk mengambil sesi pengguna di sisi server.
		 */
		interface Locals {
			supabase: ReturnType<typeof createSupabaseServerClient>;

			/**
			 * Mengambil sesi pengguna saat ini di sisi server.
			 * @returns Promise yang berisi objek Session atau null jika tidak ada sesi.
			 */
			getSession(): Promise<Session | null>;
		}

		/**
		 * Interface untuk data halaman yang dikirim ke sisi klien.
		 *
		 * @property session - Data sesi pengguna yang diteruskan ke browser, bisa null jika tidak ada sesi.
		 */
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
