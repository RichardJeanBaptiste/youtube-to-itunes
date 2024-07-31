const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const { finished } = require('stream/promises');
const youtubedl = require('youtube-dl-exec');
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');

// Video Url : 'https://www.youtube.com/watch?v=kO4_0oxZTLY'
// playlist url : https://www.youtube.com/playlist?list=PLH4RHB93Zoe_ydTTQ-TFnuPu0xs8ffwDj

const downloadVideo = async (url, outputDirectory) => {
  try {
    const videoInfo = await youtubedl(url, {
      dumpSingleJson: true
    });

    console.log(videoInfo[0].title);

    const videoTitle = videoInfo.title.replace(/[\/\\:*?"<>|]/g, '');
    const outputFilePath = path.join(outputDirectory, `${videoTitle}.mp4`);

    console.log(`Downloading video: ${videoTitle}`);
    
    youtubedl(url, {
      output: outputFilePath,
      format: 'mp4'
    }).then((output) => {
      console.log(output)
      console.log(`Video downloaded successfully to ${outputFilePath}`);
    }).catch(err => {
      console.error('Error downloading video:', err);
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
  }
};

// Example usage
const videoUrl = 'https://www.youtube.com/playlist?list=PLH4RHB93Zoe_ydTTQ-TFnuPu0xs8ffwDj';
const outputDir = './videos/4:44';

if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir);
}

downloadVideo(videoUrl, outputDir);


