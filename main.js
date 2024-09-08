const { app, BrowserWindow, ipcMain, webContents, dialog } = require('electron');
const fs = require('fs');
const path = require('node:path');
const { getVideoInfo, downloadVideo, downloadPlaylist } = require('./ytdl-downloads.js');
const PopupWindow = require('./classes.js');


const createWindow = () => {

    // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  ipcMain.handle('choose-directory', async (event) => {

    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    return result.filePaths[0];   
  })

  

  ipcMain.handle('quick-download', async (event, link) => {
      const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;
      const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/(playlist\?list=)([a-zA-Z0-9_-]+)/;

      if(videoRegex.test(link)) {
        downloadVideo(link, 'audio', 'mp3');
      } else if(playlistRegex.test(link)){
        
        const popup = new PopupWindow(link);
        popup.show();
        //openPopupWindow(link);
      } else {
        console.log("Invalid Link");
      }
  })

  ipcMain.handle('download-playlist', async (event, metadata) => {

      let x = {
        Album: metadata.Album,
        Artist: metadata.Artist,
        genre: metadata.genre
      }

      console.log(metadata);

      downloadPlaylist(metadata.link, metadata.file_location,'playlists', 'mp3', x);
  });
}


app.whenReady().then(() => {

  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

