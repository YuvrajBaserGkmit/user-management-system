const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const crypto = require('crypto');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  S3_REGION,
} = process.env;

// Create an S3 client instance with the provided AWS credentials and region
const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: AWS_S3_SECRET_ACCESS_KEY,
  },
  region: S3_REGION,
});

// Generate a random image name based on a specified byte count
const randomImageName = (byteCount) =>
  crypto.randomBytes(byteCount).toString('hex');

// Function to save a resized thumbnail image to the specified S3 bucket
const saveImageThumbnailToS3 = async (buffer, mimetype, userId) => {
  const width = 320;
  const height = 240;
  const imageName = `${randomImageName(32)}_thumbnail`;

  // Resize the image using Sharp library
  const newBuffer = await sharp(buffer)
    .resize({ height: height, width: width, fit: 'contain' })
    .toBuffer();

  // Specify S3 parameters for storing the thumbnail image
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${userId}/${imageName}`,
    Body: newBuffer,
    ContentType: mimetype,
  };
  const command = new PutObjectCommand(params);

  // Upload the thumbnail image to S3
  await s3.send(command);

  // Construct and return the URL for the thumbnail image
  const profileImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`;
  return profileImageUrl;
};

// Function to upload a user profile image to the specified S3 bucket
const uploadUserProfileImage = async (buffer, originalname, mimetype, id) => {
  const imageName = `${randomImageName(8)}_${originalname}`;

  // Specify S3 parameters for storing the user profile image
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: `${id}/${imageName}`,
    Body: buffer,
    ContentType: mimetype,
  };
  const command = new PutObjectCommand(params);

  // Upload the user profile image to S3
  const data = await s3.send(command);

  // Construct and return the URLs for the user profile image and its thumbnail
  const profileImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`;
  const imageThumbnailUrl = await saveImageThumbnailToS3(buffer, mimetype, id);
  const urlResponse = {
    profileImageUrl: profileImageUrl,
    imageThumbnailUrl: imageThumbnailUrl,
  };
  return urlResponse;
};

// Export the functions for use in other modules
module.exports = {
  uploadUserProfileImage,
};
