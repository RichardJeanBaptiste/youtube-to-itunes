const searchBtn = document.getElementById("link_btn");
const connectionStatus = document.getElementById("connection_status");

if(navigator.onLine){
    connectionStatus.innerHTML = "Online";
} else {
    connectionStatus.innerHTML = "Offline";
}

searchBtn.addEventListener('click', async () => {
    let text = await navigator.clipboard.readText();
    console.log(text);
    //window.electronAPI.searchLink(text);
    //window.electronAPI.downloadSingle(text);
    window.electronAPI.sortDownload(text);
});

const testBtn = document.getElementById("back");

testBtn.addEventListener('click', () => {
    console.log("abcdefg")
})




  