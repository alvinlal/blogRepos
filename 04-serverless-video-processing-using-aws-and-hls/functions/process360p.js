const S3 = require('aws-sdk/clients/s3');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const s3 = new S3({
  region: 'ap-south-1',
});

const process360p = event => {
  const id = event.id; // data from the invokeStepFunction lamda function
  const params = { Bucket: 'video-intake', Key: id };
  const readStream = s3.getObject(params).createReadStream(); // create s3 readStream
  var totalTime;

  fs.mkdirSync(`/tmp/${id}`);

  ffmpeg(readStream)
    .on('start', () => {
      console.log(`transcoding ${id} to 360p`);
    })
    .on('error', (err, stdout, stderr) => {
      console.log('stderr:', stderr);
      console.error(err);
    })
    .on('end', async () => {
      const fileUploadPromises = fs.readdirSync(`/tmp/${id}`).map(file => {
        let params = { Bucket: 'video-egress', Key: `${id}/${file}`, Body: fs.readFileSync(`/tmp/${id}/${file}`) };
        console.log(`uploading ${file} to s3`);
        return s3.putObject(params).promise();
      });
      await Promise.all(fileUploadPromises); // upload output to s3
      await fs.rmdirSync(`/tmp/${id}`, { recursive: true });
      console.log(`tmp is deleted!`);
    })
    .on('codecData', data => {
      totalTime = parseInt(data.duration.replace(/:/g, ''));
    })
    .on('progress', progress => {
      const time = parseInt(progress.timemark.replace(/:/g, ''));
      const percent = Math.ceil((time / totalTime) * 100);
      console.log(`progress :- ${percent}%`);
    })
    .outputOptions(['-vf scale=w=640:h=360', '-c:a aac', '-ar 48000', '-b:a 96k', '-c:v h264', '-profile:v main', '-crf 20', '-g 48', '-keyint_min 48', '-sc_threshold 0', '-b:v 800k', '-maxrate 856k', '-bufsize 1200k', '-f hls', '-hls_time 4', '-hls_playlist_type vod', `-hls_segment_filename /tmp/${id}/360p_%d.ts`])
    .output(`/tmp/${id}/360p.m3u8`) // output files are temporarily stored in tmp directory
    .run();
};

module.exports = {
  handler: process360p,
};
