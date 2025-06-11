const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const logger = require('progress-estimator')();
const { app } = require('electron');
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');


/**
 * Test Playlists
 *  An ideal for living - https://www.youtube.com/playlist?list=PLK2zhq9oy0K4yxwMmBPsXQ3NvaQSxw6rY
 *  Jar Of Flies - https://www.youtube.com/playlist?list=PL6vwnon3sINptjofzjbPaISZByQoecamo
 *  Over And Out - https://www.youtube.com/playlist?list=PLPgY7pnyXWLe-CuwuwMyWz0TDel77SsU0
 *  Blood Bank - https://www.youtube.com/playlist?list=PLN61gg9VNXPpaZx1zREUrPnzqpA5hN4y7
 * 
 * 
 * Test Single
 *  naruto - https://www.youtube.com/watch?v=q1kwt2QIzmc
 *  adele - https://www.youtube.com/watch?v=rYEDA3JcQqw
 *  shaboozy - https://youtu.be/t7bQwwqW-Hc?list=PL4fGSI1pDJn6O1LS0XSdF3RyO0Rq_LDeI
 */


ffmpeg.setFfmpegPath(ffmpegPath);

const getVideoInfo = async (url) => {

    console.log("Getting Video Info");
    console.log("=".repeat(100));

    const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;
    const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/(playlist\?list=)([a-zA-Z0-9_-]+)/;

    try {

      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true,
        //listFormats: true,
      });


      if(videoRegex.test(url)){
        //console.log(videoInfo.thumbnail);
        return {
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          description: videoInfo.description
        }
      } else if(playlistRegex.test(url)) {      
        //console.log(videoInfo.description);
        return {
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnails[0].url,
          description: videoInfo.description
        }
      } else {

        console.log("Not a youtube link:");
        return {
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          description: videoInfo.description
        }
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

const quickSingleDownload = async (url, outputDirectory, audio_format) => {
    try {
      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true
      });

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
}

const singleDownload = async (url, outputDirectory, audio_format, metadata) => {

    try {
      const videoInfo = await youtubedl(url, {
        dumpSingleJson: true
      });
  
      const videoTitle = videoInfo.title.replace(/[\/\\:*?"<>|]/g, '');
      const videoOutputDir = path.join('playlists', `${videoTitle}.${audio_format}`);
      const outputFilePath = `${outputDirectory}/${videoTitle}.${audio_format}`;
      
      await youtubedl(url, {
        output: videoOutputDir,
        format: 'best'
      }).then((output) => {
        console.log(`Video downloaded successfully to ${videoOutputDir}`);
      }).catch(err => {
        console.error('Error downloading video:', err);
      });

      //console.log(`Single Download -- videoOutputDir : ${videoOutputDir} -- outputFilePath: ${outputFilePath} `);
      const audioPromise = manageMetadata(videoOutputDir, outputFilePath, metadata, false);
      await Promise.resolve(audioPromise);
      deleteFile(videoOutputDir);
    } catch (error) {
      /**
        No Internet
        Video Blocked
       */
      console.error('Error fetching video info:', error);
    }
};


const downloadPlaylist = async (playlistUrl, updateDirectory, audio_format, metadata) => {

   
    try {
      const playlistInfo = await youtubedl(playlistUrl, {
        dumpSingleJson: true,
        flatPlaylist: true
      });

      const promises = [];

      const { title, entries } = playlistInfo;
      console.log(updateDirectory);
      console.log("================================================");
      console.log(`Downloading playlist: ${title}`);
      console.log(`Number of videos: ${entries.length}`);
      
      // // Final Final Path - Store File With Edited Metadata
      const updatedFilePath = `${updateDirectory}/${metadata.Album}`;
      console.log(`UpdatedFilePath: ${updatedFilePath}`);
  
      if (!fs.existsSync('playlists')){
        fs.mkdirSync('playlists');
      }
  
      for (const entry of entries) {
        const videoUrl = `https://www.youtube.com/watch?v=${entry.id}`;
        const videoOutputDir = path.join('playlists', title.replace(/[\/\\:*?"<>|]/g, ''));

        console.log(`Video output dir - ${videoOutputDir}`);
  
        try {
          const videoInfo = await youtubedl(videoUrl, {
            dumpSingleJson: true
          });
  
          const videoTitle = videoInfo.title.replace(/[\/\\:*?"<>|]/g, '');
          const outputFilePath = path.join(videoOutputDir, `${videoTitle}.${audio_format}`);
          
          //console.log(`OutFilePath - ${outputFilePath}`);
              
          console.log(updatedFilePath);

          if(!fs.existsSync(updatedFilePath)){
            fs.mkdirSync(updatedFilePath);
          }
          
          await youtubedl(videoUrl, {
            output: outputFilePath,
            format: 'best'
          });
        
          const metadataPromise = manageMetadata(outputFilePath, path.join(updatedFilePath, `${videoTitle}.${audio_format}`), metadata, true);
          promises.push(metadataPromise);
          console.log(`Video downloaded successfully to ${updatedFilePath}`);
        } catch (err) {
          if (err.name === 'ChildProcessError') {
            console.log(`You may have to sign in to confirm you're not a bot: ${videoUrl} ---- ${err}`);
          } else {
            console.error(`Error downloading video ${videoUrl}:`, err);
          } 
        }
      }

      await Promise.all(promises);
      deleteFolder(`${title}`);
      console.log("Playlist download finished");
    } catch (playlistError) {
      console.error('Error fetching playlist info:', playlistError);
    }
};

const getMetadata = (filePath) => {

  return new Promise((resolve, reject) => {
    exec(`${ffmpegPath} -i "${filePath}" -f ffmetadata -`, (error, stdout, stderr) => {
      if (error) {
        console.log("Error Getting Metadata: ");
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const manageMetadata = async (inputFile, outputFile, metadata) => {

  console.log(`Managing Metadata:\nInput File : ${inputFile} \nOutput File: ${outputFile}\nMetadata: ${metadata}`);

  try {
    const metadataOutput = await getMetadata(decodeURI(inputFile));
    console.log(metadataOutput);
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
    console.log(`\n===========================================\nInput File: ${inputFile} ---- Output File: ${outputFile}`);
    console.error('Error managing metadata\n', error);
  }
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

const deleteFolder = (temp) => {
  try {
    const dir = path.join(__dirname, 'playlists', temp);

    fs.rm(dir, {recursive: true, force: true}, (err) => {
      if (err) {
        return console.error(`Error deleting directory: ${err.message}`);
      }
        console.log('Directory deleted successfully!');
    }); 
  } catch (error) {
    console.log(`Error Occured When Deleting files:\n${error}`);
  }
}

const deleteFile = (temp) => {
  try {
    const filePath = path.join(__dirname, temp);

    fs.unlink(filePath, (err) => {
      if (err) {
        return console.error(`Error deleting file: ${err.message}`);
      }
      console.log('File deleted successfully!');
    }); 
  } catch (error) {
    console.log(`Error occurred when deleting the file:\n${error}`);
  }
};




module.exports = { quickSingleDownload, singleDownload, downloadPlaylist, getVideoInfo, listAudioResolutions, manageMetadata, deleteFolder, deleteFile};
