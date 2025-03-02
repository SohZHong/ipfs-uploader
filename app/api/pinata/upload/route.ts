import { pinata } from '@/common/environment';
import { NextRequest } from 'next/server';
import { PinResponse } from 'pinata-web3';

export async function POST(request: NextRequest) {
  try {
    // Get 'File' Object from FormData
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing file details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Upload to Pinata
    let response: PinResponse;
    if (files.length === 1) {
      response = await pinata.upload.file(files[0]);
    } else {
      response = await pinata.upload.fileArray(files);
    }

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
