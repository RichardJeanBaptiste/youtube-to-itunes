const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('node:path');
const { getVideoInfo, downloadVideo, downloadPlaylist } = require('./ytdl-downloads.js');


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

  

  //popupWindow.close();

  const openPopupWindow = (link) => {
    let popupWindow = new BrowserWindow({
      width: 700,
      height: 500,
      //parent: mainWindow,  // Make the main window the parent
      modal: false,         // Make the popup modal (disables main window)
      closable: true,
      resizable: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
      }
    });

    popupWindow.loadFile('./Popup/popup.html');
      popupWindow.show();
      popupWindow.webContents.on('did-finish-load', async () => {
        let info = await getVideoInfo(link);
        //console.log(info);
        popupWindow.webContents.send('videoInfo', info, link);
        //popupWindow.webContents.openDevTools();
    })
  }

  

  ipcMain.handle('quick-download', async (event, link) => {
      console.log("main process: Checking Link");
      const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;
      const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com)\/(playlist\?list=)([a-zA-Z0-9_-]+)/;

      if(videoRegex.test(link)) {
        downloadVideo(link, 'audio', 'mp3');
      } else if(playlistRegex.test(link)){
        
        openPopupWindow(link);
        
      } else {
        console.log("Invalid Link");
      }
  })

  ipcMain.handle('download-playlist', async (event, metadata) => {
      //console.log(`Main Process - Download Playlist:\n ${"===".repeat(30)}`);
      //console.log(metadata);
      let x = {
        Album: metadata.Album,
        Artist: metadata.Artist
      }

      downloadPlaylist(metadata.link, 'playlists', 'mp3', x);
      //popupWindow.hide();
  });

 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
