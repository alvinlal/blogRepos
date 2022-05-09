const AWS = require('aws-sdk');

AWS.config.update({
  region: 'ap-south-1',
});

const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const putMetadataAndPlaylist = async event => {
  const id = event.id;
  try {
    const s3Params = {
      Bucket: 'video-intake',
      Key: id,
    };

    const data = await s3.headObject(s3Params).promise(); // gets metadata from s3

    const dynamoParams = {
      TableName: 'videos',
      Item: {
        id,
        title: data.Metadata.title,
        url: `https://${process.env.CLOUDFRONT_DOMAIN}/${id}/index.m3u8`,
        status: 'processing',
      },
    };

    await dynamoDb.put(dynamoParams).promise(); // writes metadata to dynamoDb
    console.log('Successfully written metadata to dynamoDb');

    const content = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480
480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p.m3u8`;

    await s3.putObject({ Bucket: 'video-egress', Key: `${id}/index.m3u8`, Body: content }).promise(); // writes index.m3u8 to output bucket

    console.log('Successfully written index playlist to s3');

    return { id };
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  handler: putMetadataAndPlaylist,
};
