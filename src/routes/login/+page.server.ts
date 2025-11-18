import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSession();

	if (session) {
		redirect(303, '/map');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email dan password tidak boleh kosong.',
				email
			});
		}

		const { data: authData, error: authError } = await locals.supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (authError) {
			return fail(401, {
				error: 'Email atau password salah.',
				email
			});
		}

		const user = authData.user;
		const { error: sessionError } = await locals.supabase.from('user_sessions').insert({
			user_id: user.id,
			email: user.email
		});

		if (sessionError) {
			console.error('Gagal mencatat sesi:', sessionError.message);
			// Logout paksa pengguna agar tidak terjadi sesi yang 'setengah jadi'
			await locals.supabase.auth.signOut();
			return fail(500, {
				error: 'Gagal mencatat sesi. Silakan coba lagi.',
				email
			});
		}

		redirect(303, '/map');
	}
};
