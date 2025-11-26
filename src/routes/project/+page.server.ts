import { fail, type Actions } from '@sveltejs/kit';
import { PRIVATE_FASTAPI_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();

	if (!user) {
		return { projects: [] };
	}

	const { data: projects, error } = await locals.supabase
		.from('projects')
		.select('id, project_name, operation_type, created_at')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Error fetching projects:', error);
		return { projects: [] };
	}

	return { projects };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();
		if (!user) {
			return fail(401, { message: 'You must be logged in to create a project.' });
		}

		const formData = await request.formData();
		const geojsonFile = formData.get('geojsonFile') as File;
		const bufferValue = formData.get('buffer_value');

		// Validasi dasar
		if (!geojsonFile || geojsonFile.size === 0) {
			return fail(400, { message: 'No file uploaded or file is empty.' });
		}
		const allowedTypes = ['application/geo+json', 'application/json'];
		if (!allowedTypes.includes(geojsonFile.type) && !geojsonFile.name.endsWith('.geojson')) {
			return fail(400, { message: 'Invalid file type. Please upload a GeoJSON file.' });
		}
		if (!bufferValue) {
			return fail(400, { message: 'Buffer value is required.' });
		}

		try {
			const originalGeoJsonText = await geojsonFile.text();
			const originalGeoJson = JSON.parse(originalGeoJsonText);

			const apiFormData = new FormData();
			apiFormData.append('geojson_polygon', geojsonFile);
			apiFormData.append('buffer_value', bufferValue);

			const response = await fetch(`${PRIVATE_FASTAPI_URL}/buffer`, {
				method: 'POST',
				body: apiFormData
			});

			if (!response.ok) {
				const errorBody = await response.text();
				console.error('FastAPI Error:', errorBody);
				return fail(response.status, {
					message: `Failed to process buffer. Backend responded with: ${response.statusText}`
				});
			}

			const processedGeoJson = await response.json();

			const { error: dbError } = await locals.supabase.from('projects').insert({
				user_id: user.id,
				project_name: geojsonFile.name,
				operation_type: 'buffer',
				original_geojson: originalGeoJson,
				processed_geojson: processedGeoJson
			});

			if (dbError) {
				console.error('Supabase Error:', dbError);
				return fail(500, { message: 'Failed to save project to database.' });
			}

			return { success: true, message: `Project '${geojsonFile.name}' created successfully!` };
		} catch (error) {
			console.error('Processing Error:', error);
			if (error instanceof SyntaxError) {
				return fail(400, { message: 'Invalid GeoJSON file format. Could not parse.' });
			}
			return fail(500, { message: 'An unexpected error occurred on the server.' });
		}
	}
};
