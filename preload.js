const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('electronAPI', {
    searchLink: (link) => {
        ipcRenderer.invoke('open-popup', link);
    },
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
})