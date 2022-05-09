const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cloudfront = new AWS.CloudFront();

const finalize = async event => {
  try {
    const id = event[4].id;

    const dynamoParams = {
      TableName: 'videos',
      Key: {
        id,
      },
      UpdateExpression: 'set #videoStatus = :x',
      ExpressionAttributeNames: { '#videoStatus': 'status' }, // because status is reserved keyword in dynamoDb
      ExpressionAttributeValues: {
        ':x': 'finished',
      },
    };

    await dynamoDb.update(dynamoParams).promise(); // updates status of the video
    console.log('Successfully updated video status');

    const cloudfrontParams = {
      DistributionId: process.env.CLOUDFRONT_ID,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: [`/${id}/*`],
        },
      },
    };

    await cloudfront.createInvalidation(cloudfrontParams).promise(); // invalidates cloudfront distribution
    console.log('cloudfront invalidated');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handler: finalize,
};
