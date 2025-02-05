// utils/r2Client.js
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.R2_ACCESS_KEY_ID, // Your R2 access key
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY, // Your R2 secret key
  endpoint: process.env.END_POINT, // R2 endpoint
  region: 'auto', // R2 uses the 'auto' region
  signatureVersion: 'v4',
});

export const uploadToR2 = (bucketName, fileName, content) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: content,
    ContentType: 'application/vnd.apple.mpegurl', // MIME type for M3U8 files
  };
  return s3.upload(params).promise();
};
