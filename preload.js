const { contextBridge, ipcRenderer } = require('electron/renderer');


contextBridge.exposeInMainWorld('electronAPI', {
    searchLink: (link) => {
        ipcRenderer.invoke('open-popup', link);
    },
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    sortDownload: (link) => {
        ipcRenderer.invoke('sort-download', link);
    },
    quickDownload: (link) => {
        ipcRenderer.invoke('quick-download', link);
    },
    downloadSingle: (metadata) => {
        ipcRenderer.invoke('single-download', metadata);
    },
    downloadPlaylist: (metadata) => {
        ipcRenderer.invoke('download-playlist', metadata);
    },
    chooseDir: async () => {
        let result = await ipcRenderer.invoke('choose-directory');
        console.log(result);
        return result;
    }
})