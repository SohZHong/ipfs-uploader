export const FILEBASE_ACCESS_KEY = process.env.FILEBASE_ACCESS_KEY;
export const FILEBASE_SECRET_KEY = process.env.FILEBASE_SECRET_KEY;
export const FILEBASE_BUCKET_NAME = process.env.FILEBASE_BUCKET_NAME;

// Validate that all required environment variables are set
if (!FILEBASE_ACCESS_KEY || !FILEBASE_SECRET_KEY || !FILEBASE_BUCKET_NAME) {
  throw new Error(
    `Missing required environment variables: ${
      !FILEBASE_ACCESS_KEY ? 'FILEBASE_ACCESS_KEY, ' : ''
    }${!FILEBASE_SECRET_KEY ? 'FILEBASE_SECRET_KEY, ' : ''}${
      !FILEBASE_BUCKET_NAME ? 'FILEBASE_BUCKET_NAME' : ''
    }`
  );
}
