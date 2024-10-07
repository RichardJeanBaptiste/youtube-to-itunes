const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions, downloadVideo, downloadPlaylist, manageMetadata, deleteFolder } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');


//const imgPath = path.join(__dirname, '444.png');
//const imgBuffer = fs.readFileSync(imgPath);


// let metadata = {
//     Album: "ABC1",
//     Artist: "ABC2",
//     "Album Artwork": imgPath,
// }

//manageMetadata('test.mp3','update.mp3', metadata);
//getVideoInfo("https://www.youtube.com/playlist?list=PLN61gg9VNXPpaZx1zREUrPnzqpA5hN4y7");
//getVideoInfo("https://www.youtube.com/watch?v=rYEDA3JcQqw");