const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { openFile } =require('./eletron_functions.js');
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


const sld = singleDownload("https://www.youtube.com/watch?v=q1kwt2QIzmc", "/Users/rich/Desktop", "m4a", metadata);

const progress = logger(sld, `ABC`)
console.log(progress)







