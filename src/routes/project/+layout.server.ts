import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	// Jika tidak ada user, redirect ke halaman login
	if (!user) {
		redirect(303, '/login');
	}

	// Ambil data sesi untuk diteruskan ke halaman
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();

	return {
		session: session
	};
};
