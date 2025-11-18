import type { Session } from '@supabase/supabase-js';
import type { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Database } from '$lib/database.types';

declare global {
	namespace App {
		interface Locals {
			supabase: ReturnType<typeof createSupabaseServerClient<Database>>;

			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
	}
}

export {};
