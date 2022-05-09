const S3 = require('aws-sdk/clients/s3');
const crypto = require('crypto');

const s3 = new S3({
  region: 'ap-south-1',
});

const createPresignedUrl = metaData => {
  const params = {
    Fields: {
      key: crypto.randomBytes(8).toString('hex'),
      'x-amz-meta-title': metaData.title,
    },
    Conditions: [
      ['starts-with', '$Content-Type', 'video/'],
      ['content-length-range', 0, 500000000],
    ],
    Expires: 60,
    Bucket: 'video-intake',
  };
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
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
