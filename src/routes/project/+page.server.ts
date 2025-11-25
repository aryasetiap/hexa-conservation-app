import { fail, type Actions } from '@sveltejs/kit';
import fs from 'node:fs/promises';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const uploadedFile = formData.get('uploadedFile') as File;

    if (!uploadedFile || uploadedFile.size === 0) {
      return fail(400, { message: 'No file uploaded or file is empty.' });
    }

    // Basic validation (e.g., file type, size)
    if (!uploadedFile.type.startsWith('image/')) {
      return fail(400, { message: 'Only image files are allowed.' });
    }

    try {
      // Create a buffer from the file data
      const buffer = Buffer.from(await uploadedFile.arrayBuffer());

      // Define the path to save the file (e.g., in a 'static/uploads' directory)
      const uploadDir = 'static/uploads'; // Or a more robust storage solution
      await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists
      const filePath = `${uploadDir}/${uploadedFile.name}`;

      // Write the file to the server's file system
      await fs.writeFile(filePath, buffer);

      return { success: true, message: 'File uploaded successfully!' };
    } catch (error) {
      console.error('Error uploading file:', error);
      return fail(500, { message: 'Failed to upload file.' });
    }
  }
};