import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { filename, filetype } = req.body;

    // Generate a signed URL for direct upload
    const params = {
      Bucket: FILEBASE_BUCKET_NAME,
      Key: filename,
      ContentType: filetype,
      ACL: 'public-read',
    };

    // const request = s3.putObject(params);
    // request.send();
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    // Filebase stores files on IPFS, so CID is derived from filename
    const ipfsCID = `ipfs://${filename}`;

    res.status(200).json({ uploadUrl, ipfsCID });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
