import { pinata } from '@/common/environment';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get 'File' Object from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Missing file details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('File:', { name: file.name, size: file.size, type: file.type });

    // Upload to Pinata
    const response = await pinata.upload.file(file);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to upload to Pinata' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
