const S3 = require('aws-sdk/clients/s3');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

const s3 = new S3({
  region: 'ap-south-1',
});

const process480p = event => {
  const id = event.id;
  const params = { Bucket: 'video-intake', Key: id };
  const readStream = s3.getObject(params).createReadStream();
  var totalTime;

  fs.mkdirSync(`/tmp/${id}`);

  ffmpeg(readStream)
    .on('start', () => {
      console.log(`transcoding ${id} to 480p`);
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
      await Promise.all(fileUploadPromises);
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
    .outputOptions(['-vf scale=w=842:h=480', '-c:a aac', '-ar 48000', '-b:a 128k', '-c:v h264', '-profile:v main', '-crf 20', '-g 48', '-keyint_min 48', '-sc_threshold 0', '-b:v 1400k', '-maxrate 1498k', '-bufsize 2100k', '-f hls', '-hls_time 4', '-hls_playlist_type vod', `-hls_segment_filename /tmp/${id}/480p_%d.ts`])
    .output(`/tmp/${id}/480p.m3u8`)
    .run();
};

module.exports = {
  handler: process480p,
};
