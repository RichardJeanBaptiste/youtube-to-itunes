const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions, singleDownload, manageMetadata, deleteFolder } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');
const youtubedl = require('youtube-dl-exec');
const path = require('path');


let x = {
    Album: 'ABC',
    Artist: 'DEF'
}

singleDownload("https://www.youtube.com/watch?v=FzA_UaajqZY","/Users/rich/Desktop",'m4a',x);