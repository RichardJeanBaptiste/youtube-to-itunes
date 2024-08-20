const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { getVideoInfo, listAudioResolutions, downloadVideo, downloadPlaylist, manageMetadata } = require('./ytdl-downloads'); 
//const youtubedl = require('youtube-dl-exec').create('path/to/binary');
const youtubedl = require('youtube-dl-exec');

// Video Url : 'https://www.youtube.com/watch?v=kO4_0oxZTLY'
// playlist url : https://www.youtube.com/playlist?list=PLH4RHB93Zoe_ydTTQ-TFnuPu0xs8ffwDj

//getVideoInfo("https://www.youtube.com/watch?v=SZs3JRSmazY");

//downloadVideo("https://www.youtube.com/watch?v=SZs3JRSmazY", "audio", "mp3");

 let x = "Might Delete Later";
 let y = "J. Cole";

 //let xEdit = " " + x + " ";
 //let yEdit = " " + y + " ";

const metadata = {
    Album: x,
    Artist: y,
}
downloadPlaylist("https://www.youtube.com/playlist?list=PLA43DqAcT2MGquM10U3Aa1McZ8zboDT42", "playlists", "mp3", metadata);

// const videoUrl = 'https://www.youtube.com/watch?v=kO4_0oxZTLY';

// youtubedl(videoUrl, {
//     output: 'audio/audio.mp3', // Specify output format
//     format: 'best' // Download the best available quality
// }).then(output => {
//     console.log('Download complete:', output);
// }).catch(err => {
//     console.error('Error downloading video:', err);
// });

//manageMetadata('test.mp3','update.mp3', metadata);