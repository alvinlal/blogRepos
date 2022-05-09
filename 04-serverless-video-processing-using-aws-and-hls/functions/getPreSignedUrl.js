const S3 = require('aws-sdk/clients/s3'); // no need to install aws-sdk, available without installing for all nodejs lambda functions
const crypto = require('crypto');

const s3 = new S3({
  region: 'ap-south-1',
});

const createPresignedUrl = metaData => {
  // metadata can contain additional info send from the client
  const params = {
    Fields: {
      key: crypto.randomBytes(8).toString('hex'), // returns a random string
      'x-amz-meta-title': metaData.title, // setting object metadata, has to be in the form x-amz-meta-yourmetadatakey
    },
    Conditions: [
      ['starts-with', '$Content-Type', 'video/'], // accept only videos
      ['content-length-range', 0, 500000000], // max size in bytes, 500mb
    ],
    Expires: 60, // url expires after 60 seconds
    Bucket: 'video-intake',
  };
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      // we have to promisify s3.createPresignedPost because it does not have a .promise method like other aws sdk methods
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
};

const getPreSignedUrl = async event => {
  try {
    const data = await createPresignedUrl(JSON.parse(event.body));
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};

module.exports = {
  handler: getPreSignedUrl,
};
