const { BrowserWindow } = require('electron');
const path = require('path');
const { getVideoInfo } = require('./ytdl-downloads.js');


class PopupWindow {
    constructor(link) {
        this.window = new BrowserWindow({
            width: 700,
            height: 500,
            modal: false,         // Make the popup non-modal (doesn't disable the main window)
            closable: true,
            resizable: true,
            show: false,          // Initially hide the window until content is ready
            webPreferences: {
              nodeIntegration: true,
              preload: path.join(__dirname, './preload.js')
            }
        });

        this.window.loadFile('./Popup/popup.html');

        this.window.webContents.on('did-finish-load', async () => {
            let info = await getVideoInfo(link);
            this.window.webContents.send('videoInfo', info, link);
        });

        this.show = () => {
            this.window.show();
        }

        this.close = () => {
            if (this.window) {
              this.window.close();
            }
        }
    }
}

module.exports = PopupWindow;