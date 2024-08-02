const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');

// Video Url : 'https://www.youtube.com/watch?v=kO4_0oxZTLY'
// playlist url : https://www.youtube.com/playlist?list=PLH4RHB93Zoe_ydTTQ-TFnuPu0xs8ffwDj

// getVideoInfo("https://www.youtube.com/watch?v=Rejc0w2V9Kk");

listAudioResolutions("https://www.youtube.com/watch?v=Rejc0w2V9Kk");