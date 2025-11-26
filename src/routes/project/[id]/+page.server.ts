import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();

	if (!session) {
		redirect(303, '/login');
	}

	const projectId = params.id;

	const { data: project, error: dbError } = await locals.supabase
		.from('projects')
		.select('id, project_name, operation_type, original_geojson, processed_geojson, created_at')
		.eq('id', projectId)
		.eq('user_id', session.user.id)
		.single();

	if (dbError || !project) {
		console.error('Error fetching project or project not found:', dbError?.message);
		error(404, 'Project not found or you do not have permission to view it.');
	}

	return {
		project
	};
};
