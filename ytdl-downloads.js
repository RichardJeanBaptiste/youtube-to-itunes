const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const logger = require('progress-estimator')();
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');


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
        format: 'mp3'
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

const downloadPlaylist = async (playlistUrl, outputDirectory) => {
    try {
      const playlistInfo = await youtubedl(playlistUrl, {
        dumpSingleJson: true,
        flatPlaylist: true
      });
  
      const { title, entries } = playlistInfo;
      console.log(`Downloading playlist: ${title}`);
      console.log(`Number of videos: ${entries.length}`);
  
      if (!fs.existsSync(outputDirectory)){
        fs.mkdirSync(outputDirectory);
      }
  
      for (const entry of entries) {
        const videoUrl = `https://www.youtube.com/watch?v=${entry.id}`;
        const videoOutputDir = path.join(outputDirectory, title.replace(/[\/\\:*?"<>|]/g, ''));
  
        if (!fs.existsSync(videoOutputDir)){
          fs.mkdirSync(videoOutputDir);
        }
  
        try {
          const videoInfo = await youtubedl(videoUrl, {
            dumpSingleJson: true
          });
  
          const videoTitle = videoInfo.title.replace(/[\/\\:*?"<>|]/g, '');
          const outputFilePath = path.join(videoOutputDir, `${videoTitle}.mp4`);
  
          console.log(`Downloading video: ${videoTitle}`);
          
          const promise = youtubedl(videoUrl, {
              output: outputFilePath,
              format: 'mp4'
          });
          
          const result = await logger(promise, `Obtaining ${videoTitle}`);
  
          console.log(result);
          // await youtubedl(videoUrl, {
          //   output: outputFilePath,
          //   format: 'mp4'
          // });
  
          console.log(`Video downloaded successfully to ${outputFilePath}`);
        } catch (videoError) {
          console.error(`Error downloading video ${videoUrl}:`, videoError);
        }
      }
    } catch (playlistError) {
      console.error('Error fetching playlist info:', playlistError);
    }
};

module.exports = { downloadVideo, downloadPlaylist };