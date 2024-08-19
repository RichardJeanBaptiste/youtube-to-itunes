let currentLink;

window.electronAPI.receive('currentLink', (message) => {
    console.log(message); // Prints 'Hello from the main process'
    document.getElementById("link").innerHTML = message;
});

window.electronAPI.receive('videoInfo', (info, link) => {
    //console.log(info);
    currentLink = link;
    document.getElementById("title").innerHTML = info.title;
    document.getElementById("desc").innerHTML = info.description;
})

document.getElementById("submit_btn").addEventListener('click', async () => {

    console.log(currentLink);

    if(currentLink === undefined){
        alert("Item Loading.....");
    } else {
        let metadata = {
            link: currentLink,
            title : document.getElementById("album_name").value,
            artist: document.getElementById("artist_name").value,
            thumbnail: document.getElementById("thumbnail").value
        }
    
        console.log(metadata);
        window.electronAPI.downloadPlaylist(metadata);
    }
    
    
    
})
