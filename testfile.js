const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions, downloadVideo, downloadPlaylist, manageMetadata, deleteFolder } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');
const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');


const imgPath = path.join(__dirname, '444.png');
const imgBuffer = fs.readFileSync(imgPath);


let metadata = {
    Album: "ABC1",
    Artist: "ABC2",
    "Album Artwork": imgPath,
}

manageMetadata('test.mp3','update.mp3', metadata);