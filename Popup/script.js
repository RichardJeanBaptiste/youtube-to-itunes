let currentLink;

window.electronAPI.receive('currentLink', (message) => {
    //console.log(message); 
    document.getElementById("link").innerHTML = message;
});

window.electronAPI.receive('videoInfo', (info, link) => {
    //console.log(info);
    currentLink = link;
    document.getElementById("title").innerHTML = info.title;
    document.getElementById("desc").innerHTML = info.description;
    document.getElementById("display_loading").style.display = "none";
    document.getElementById("display_window").style.display = "block";
})

document.getElementById("submit_btn").addEventListener('click', async () => {

    console.log(currentLink);

    if(currentLink === undefined){
        alert("Item Loading.....");
    } else {
        let metadata = {
            link: currentLink,
            Album : document.getElementById("album_name").value,
            Artist: document.getElementById("artist_name").value,
            thumbnail: document.getElementById("thumbnail").value
        }
        //console.log(metadata);
        window.electronAPI.downloadPlaylist(metadata);

        // let window = remote.getCurrentWindow(); // Get the current window (the popup)
        // window.close();
    }
    
    
    
})
