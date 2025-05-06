const searchBtn = document.getElementById("link_btn");
const connectionStatus = document.getElementById("connection_status");

if(navigator.onLine){
    connectionStatus.innerHTML = "<i class='fa-solid fa-signal'></i>";
} else {
    connectionStatus.innerHTML = "<i class='fa-solid fa-circle-xmark'></i>";
}

searchBtn.addEventListener('click', async () => {
    let text = await navigator.clipboard.readText();
    //window.electronAPI.searchLink(text);
    //window.electronAPI.downloadSingle(text);
    window.electronAPI.sortDownload(text);
});

const testBtn = document.getElementById("back");

window.electronAPI.onSendDownload((value) => {
    //document.getElementById("abc").innerHTML = `${value}`;
    let ul = document.getElementById("download_list");
    let li = document.createElement('li');
    li.appendChild(document.createTextNode(`${value.Album} - ${value.Artist}`));
    li.setAttribute("id", "li_style");
    ul.appendChild(li);
})




  