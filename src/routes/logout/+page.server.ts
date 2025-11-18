import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals }) => {
		// Sign out from Supabase
		const { error } = await locals.supabase.auth.signOut();

		if (error) {
			console.error('Error logging out:', error.message);
		}

		// Redirect to login page
		redirect(303, '/login');
	}
};