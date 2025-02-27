import { NextRequest } from 'next/server';
import AWS from 'aws-sdk';
import {
  FILEBASE_ACCESS_KEY,
  FILEBASE_SECRET_KEY,
  FILEBASE_BUCKET_NAME,
} from '@/common/environment';

// Configure Filebase (S3-compatible storage)
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: FILEBASE_ACCESS_KEY,
  secretAccessKey: FILEBASE_SECRET_KEY,
  endpoint: 'https://s3.filebase.com',
  signatureVersion: 'v4',
  region: 'us-east-1',
  s3ForcePathStyle: true,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse JSON body
    const { fileName, filetype } = body;

    if (!fileName || !filetype) {
      return new Response(JSON.stringify({ error: 'Missing file details' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a signed URL for direct upload
    const params = {
      Bucket: FILEBASE_BUCKET_NAME,
      Key: fileName,
      ContentType: filetype,
      ACL: 'public-read',
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    // Filebase stores files on IPFS, so CID is derived from the filename
    const ipfsCID = `ipfs://${fileName}`;

    return new Response(JSON.stringify({ uploadUrl, ipfsCID }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate upload URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
