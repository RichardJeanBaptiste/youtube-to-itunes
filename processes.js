const { app, BrowserWindow } = require('electron');

const createPopUpWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    // and load the index.html of the app.
    mainWindow.loadFile('./Popup/popup.html');
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

module.exports = { createPopUpWindow };