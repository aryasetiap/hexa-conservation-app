import { fail, type Actions } from '@sveltejs/kit';

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

		if (!geojsonFile || geojsonFile.size === 0) {
			return fail(400, { message: 'No file uploaded or file is empty.' });
		}

		// Validate file type for GeoJSON
		const allowedTypes = ['application/geo+json', 'application/json'];
		if (!allowedTypes.includes(geojsonFile.type) && !geojsonFile.name.endsWith('.geojson')) {
			return fail(400, { message: 'Invalid file type. Please upload a GeoJSON file.' });
		}

		if (!bufferValue) {
			return fail(400, { message: 'Buffer value is required.' });
		}

		// TODO (untuk Stage 4):
		// 1. Panggil API FastAPI '/buffer' dengan 'geojsonFile' dan 'bufferValue'.
		// 2. Ambil GeoJSON asli dan GeoJSON hasil buffer.
		// 3. Simpan keduanya ke tabel 'projects' di Supabase.

		return { success: true, message: 'File received. Processing will be implemented in Stage 4.' };
	}
};
