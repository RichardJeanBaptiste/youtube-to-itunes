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
    // let li = document.createElement('li');
    // li.appendChild(document.createTextNode(`${value.Album} - ${value.Artist}`));
    // li.setAttribute("id", "li_style");

    let li = createListItem(value.Artist, value.Album);
    ul.appendChild(li);
})

const createListItem = (Artist, Album) => {
    let li = document.createElement('li');
    li.style.paddingBottom = '2%';

    let p1 = document.createElement("p");
    p1.textContent = `${Album}`;
    p1.style.position = 'absolute';
    p1.style.left = '7%';

    let p2 = document.createElement("p");
    p2.textContent = `${Artist}`;
    p2.style.position = 'absolute';

    let i1 = document.createElement("i");
    i1.setAttribute("class", "fa-solid fa-folder-open");
    i1.style.position = 'absolute';
    i1.style.right = '6%';

    let i2 = document.createElement("i");
    i2.setAttribute("class", "fa-solid fa-circle-xmark");
    i2.style.position = 'absolute';
    i2.style.right = '0%';

    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(i1);
    li.appendChild(i2);

    return li;
}





  