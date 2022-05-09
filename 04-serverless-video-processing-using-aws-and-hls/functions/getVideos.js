const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getVideos = async () => {
  try {
    const params = {
      TableName: 'videos',
    };

    const videos = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(videos.Items),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};

module.exports = {
  handler: getVideos,
};
