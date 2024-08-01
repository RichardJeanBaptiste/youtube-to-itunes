const { app, BrowserWindow, ipcMain, webContents } = require('electron');
const path = require('node:path')

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
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  ipcMain.handle('open-popup', async(event, link) => {
    let currentLink = await link;

    let popupWindow = new BrowserWindow({
      width: 700,
      height: 500,
      parent: mainWindow,  // Make the main window the parent
      modal: false,         // Make the popup modal (disables main window)
      closable: true,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, './preload.js')
      }
    });
    
    popupWindow.loadFile('./Popup/popup.html');
    
    popupWindow.webContents.on('did-finish-load', () => {
      popupWindow.webContents.send("currentLink", currentLink);
    });
    
    popupWindow.webContents.openDevTools(); // Optional: open DevTools for the popup window

  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

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
