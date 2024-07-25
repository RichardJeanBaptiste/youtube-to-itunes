const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('electronAPI', {
    searchLink: (link) => {
        console.log(link);
        ipcRenderer.send('open-popup');
    }
})