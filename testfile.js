const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions, downloadVideo, downloadPlaylist, manageMetadata, deleteFolder, singleDownload } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const logger = require('progress-estimator')();


//const imgPath = path.join(__dirname, '444.png');
//const imgBuffer = fs.readFileSync(imgPath);


let metadata = {
    Album: "ABC1",
    Artist: "ABC2",
}

//manageMetadata('test.m4a','update.mp3', metadata);
//getVideoInfo("https://www.youtube.com/playlist?list=PLN61gg9VNXPpaZx1zREUrPnzqpA5hN4y7");
//getVideoInfo("https://www.youtube.com/watch?v=rYEDA3JcQqw");

// const playlistInfo = await youtubedl("https://www.youtube.com/playlist?list=PLN61gg9VNXPpaZx1zREUrPnzqpA5hN4y7", {
//     dumpSingleJson: true,
//     flatPlaylist: true
// });

// youtubedl("https://www.youtube.com/watch?v=rYEDA3JcQqw", {
//     output: "/Desktop/ABC123",
//     format: 'best'
// }).then((output) => {
// console.log(output)
// console.log(`Video downloaded successfully to ${"ABC123.mp3"}`);
// }).catch(err => {
// console.error('Error downloading video:', err);
// });


// const videoUrl = `https://www.youtube.com/watch?v=${entry.id}`;
// const videoOutputDir = path.join('playlists', title.replace(/[\/\\:*?"<>|]/g, ''));


singleDownload("https://www.youtube.com/watch?v=q1kwt2QIzmc", "/Users/rich/Desktop", "m4a", metadata);

