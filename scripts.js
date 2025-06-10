const searchBtn = document.getElementById("link_btn");
const connectionStatus = document.getElementById("connection_status");

if(navigator.onLine){
    connectionStatus.innerHTML = "<i class='fa-solid fa-signal' style = 'color : green;'></i>";
} else {
    connectionStatus.innerHTML = "<p>Offline</p>";
}

searchBtn.addEventListener('click', async () => {
    let text = await navigator.clipboard.readText();
    //window.electronAPI.searchLink(text);
    //window.electronAPI.downloadSingle(text);
    window.electronAPI.sortDownload(text);
});

const testBtn = document.getElementById("back");

window.electronAPI.onSendDownload((value) => {
    let ul = document.getElementById("download_list");
    let li = createListItem(value.Artist, value.Album);
    ul.appendChild(li);
})

const createListItem = (Artist, Album) => {
    let li = document.createElement('li');
    li.style.display= 'flex';
    li.style.flexDirection = 'row';
    li.style.marginTop = '2%';
    li.style.paddingBottom = '4%';
    li.style.borderBottomStyle = 'solid';
    li.style.borderColor = 'lightgrey';
    li.style.borderWidth = '2px';

    let p1 = document.createElement("p");
    p1.textContent = `Title: ${Album}`;
    p1.style.width = '35%';
    p1.style.height = '50px';
    p1.style.overflow = 'hidden';
    p1.style.textOverflow = 'ellipsis';

    let p2 = document.createElement("p");
    p2.textContent = `Author: ${Artist}`;
    p2.style.width = '39%';
    p2.style.height = '50px';
    p2.style.overflow = 'hidden';
    p2.style.textOverflow = 'ellipsis';
    p2.style.marginLeft = '1%';

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

    i2.addEventListener('click', () => {
       li.parentNode.removeChild(li); 
    });

    return li;
}





  