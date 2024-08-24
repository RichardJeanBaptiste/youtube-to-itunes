const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const logger = require('progress-estimator')();
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');



ffmpeg.setFfmpegPath(ffmpegPath);

const getVideoInfo = async (url) => {

    console.log("=".repeat(100));
    try {
        const videoInfo = await youtubedl(url, {
            dumpSingleJson: true,
            //listFormats: true,
        });

        //console.log(videoInfo);

        return {
            title: videoInfo.title,
            thumbnail: videoInfo.thumbnail,
            description: videoInfo.description
        }
    } catch (error) {
        console.error('Error fetching video info:', error);
        return error;
    }
}

const listAudioResolutions = async (url) => {
    try {
      const formats = await youtubedl(url, {
        listFormats: true
      });
  
      const lines = formats.split('\n');
      const audioFormats = lines.filter(line => line.includes('audio only'));
  
      if (audioFormats.length === 0) {
        console.log('No audio formats found.');
        return;
      }
  
      console.log('Available audio resolutions:');
      console.log(audioFormats[0]);
      audioFormats.forEach(format => {
        console.log(`${format}`);
      });
    } catch (error) {
      console.error('Error fetching formats:', error);
    }
};

const downloadVideo = async (url, outputDirectory, audio_format) => {
    try {
      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true
      });

      const currentDir = process.cwd();
  
      const videoTitle = videoInfo.title.replace(/[\/\\:*?"<>|]/g, '');
      const outputFilePath = `${outputDirectory}/${videoTitle}.${audio_format}`;
  
      console.log(`Downloading video: ${videoTitle}`);
      
      youtubedl(url, {
        output: outputFilePath,
        format: 'best'
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

const downloadPlaylist = async (playlistUrl, updateDirectory ,outputDirectory,audio_format, metadata) => {
    try {
      const playlistInfo = await youtubedl(playlistUrl, {
        dumpSingleJson: true,
        flatPlaylist: true
      });

      const { title, entries } = playlistInfo;
      console.log(`Downloading playlist: ${title}`);
      console.log(`Number of videos: ${entries.length}`);
      
      // Final Final Path - Store File With Edited Metadata
      const updatedFilePath = `${updateDirectory}/${metadata.Album}`;
      console.log(`UpdatedFilePath: ${updatedFilePath}`);
  
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
          const outputFilePath = path.join(videoOutputDir, `${videoTitle}.${audio_format}`);
  
          //console.log(`Downloading video: ${videoTitle}`);
          
          const promise = youtubedl(videoUrl, {
              output: outputFilePath,
              format: 'best'
          });
          
          const result = await logger(promise, `Obtaining ${videoTitle}`);
  
          //console.log(result);
          
          await youtubedl(videoUrl, {
            output: outputFilePath,
            format: 'best'
          });

          
          if(!fs.existsSync(updatedFilePath)){
            fs.mkdirSync(updatedFilePath);
          }
        
          manageMetadata(outputFilePath, `${updatedFilePath}/${videoTitle}.${audio_format}`, metadata);
          console.log(`Video downloaded successfully to ${updatedFilePath}`);
        } catch (videoError) {
          console.error(`Error downloading video ${videoUrl}:`, videoError);
        }
      }
      console.log("pldl...finished");
    } catch (playlistError) {
      console.error('Error fetching playlist info:', playlistError);
    }
};



const getMetadata = (filePath) => {

  return new Promise((resolve, reject) => {
    exec(`${ffmpegPath} -i "${filePath}" -f ffmetadata -`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};


const updateMetadata = (inputFile, outputFile, newMetadata) => {

  console.log(`updateMetadata: input file: ${inputFile} - output file: ${outputFile}`);

  return new Promise((resolve, reject) => {
    const outputOptions = [];
    Object.entries(newMetadata).forEach(([key, value]) => {

      let valueEdit = " " + value + " ";
      outputOptions.push(`-metadata`, `${key}=${valueEdit}`);
    });

    ffmpeg(inputFile)
      .outputOptions(outputOptions)
      .save(outputFile)
      .on('end', () => resolve('Metadata updated successfully'))
      .on('error', reject);
  });
};

const manageMetadata = async (inputFile, outputFile, metadata) => {

  try {

    const metadataOutput = await getMetadata(decodeURI(inputFile));
    const metadataLines = metadataOutput.split('\n');
    const existingMetadata = {};

    metadataLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        existingMetadata[key] = value;
      }
    });

    const newMetadata = {};
    for (const [key, value] of Object.entries(metadata)) {
      if (!existingMetadata[key]) {
        newMetadata[key] = value;
      } else {
        console.log(`Metadata category "${key}" already exists with value "${existingMetadata[key]}"`);
      }
    }

    if (Object.keys(newMetadata).length > 0) {
      await updateMetadata(inputFile, outputFile, newMetadata);
      console.log('Metadata added successfully');
    } else {
      console.log('No new metadata to add');
    }
    
  } catch (error) {
    console.error('Error managing metadata:', error);
  }
};




module.exports = { downloadVideo, downloadPlaylist, getVideoInfo, listAudioResolutions, manageMetadata };
