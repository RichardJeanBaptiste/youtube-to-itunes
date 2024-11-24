/**
 * Test Playlists
 *  An ideal for living - https://www.youtube.com/playlist?list=PLK2zhq9oy0K4yxwMmBPsXQ3NvaQSxw6rY
 *  Jar Of Flies - https://www.youtube.com/playlist?list=PL6vwnon3sINptjofzjbPaISZByQoecamo
 *  Over And Out - https://www.youtube.com/playlist?list=PLPgY7pnyXWLe-CuwuwMyWz0TDel77SsU0
 *  Blood Bank - https://www.youtube.com/playlist?list=PLN61gg9VNXPpaZx1zREUrPnzqpA5hN4y7
 */

let currentLink;

window.electronAPI.receive('currentLink', (message) => {
    document.getElementById("link").innerHTML = message;
});

window.electronAPI.receive('videoInfo', (info, link) => {
    //console.log(info);
    currentLink = link;

    if(info.thumbnail != undefined){
        document.getElementById("thumbnail").src = info.thumbnail;
    }
    document.getElementById("title").innerHTML = info.title;
    document.getElementById("desc").innerHTML = info.description;
    document.getElementById("display_loading").style.display = "none";
    document.getElementById("display_window").style.display = "block";
})

document.getElementById("file_location").addEventListener('click', async () => {
    let x = await window.electronAPI.chooseDir();
    document.getElementById("loc").innerHTML = x;    
});

document.getElementById("clear_btn").addEventListener('click', async () => {
    document.getElementById("album_name").value = "";
    document.getElementById("artist_name").value = "";
    document.getElementById("genre").value = "HipHop/Rap";
    document.getElementById("format").value = "mp3";
    document.getElementById("comments").value = "";
})


document.getElementById("submit_btn").addEventListener('click', async (e) => {

    if(currentLink === undefined){
        alert("Item Loading.....");
    } else {

        /**
         * Metadata List
         *  Album Artist
         *  Composer
         *  Year
         *  Comments
         *  Genre      
         */

        let albumName = document.getElementById("album_name").value;
        let artistName = document.getElementById("artist_name").value;
        let genre = document.getElementById("genre").value;
        let format = document.getElementById("format").value;
        let comments = document.getElementById("comments").value || " ";

        if(!albumName || !artistName){
            e.preventDefault();
            alert('Please fill in both the Album Name and Artist Name fields.');
            return false;
        }
        
        let metadata = {
            link: currentLink,
            format: format,
            file_location: document.getElementById("loc").innerHTML,
            Album : albumName,
            Artist: artistName,
            genre: genre,
            comments: comments
        }

        //console.log(metadata);
        window.electronAPI.downloadPlaylist(metadata);
        window.close();
        
    }    
})
