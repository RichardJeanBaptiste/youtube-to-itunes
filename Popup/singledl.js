/**
 * 
 * Test Single Link
 * 
 *  sukuna edit - https://www.youtube.com/watch?v=FzA_UaajqZY
 */

window.electronAPI.receive('videoInfo', (info, link) => {
    //console.log(info);
    currentLink = link;

    if(info.thumbnail != undefined){
        document.getElementById("thumbnail").src = info.thumbnail;
    }

    if(info.description.length > 100){
        info.description = info.description.slice(0, -50) + "....";
    }
    document.getElementById("title").innerHTML = info.title;
    document.getElementById("desc").innerHTML = info.description;
    //document.getElementById("thumbnail").src = info.thumbnail;
    document.getElementById("display_loading").style.display = "none";
    document.getElementById("display_p").style.display = "none";
    document.getElementById("display_window").style.display = "block";
});

document.getElementById("file_location").addEventListener('click', async () => {
    let x = await window.electronAPI.chooseDir();
    document.getElementById("loc").innerHTML = x;    
});

document.getElementById("clear_btn").addEventListener('click', async () => {
    document.getElementById("album_name").value = "";
    document.getElementById("artist_name").value = "";
    document.getElementById("loc").innerHTML = "";
    document.getElementById("genre").value = "HipHop/Rap";
    document.getElementById("format").value = "mp3";
    document.getElementById("comments").value = ""; 
});

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

        if(document.getElementById("loc").innerHTML == "" || document.getElementById("loc").innerHTML == null || document.getElementById("loc").innerHTML == undefined){
            alert("Please enter a file location");
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

        
        window.electronAPI.downloadSingle(metadata);
        window.electronAPI.displayProgress(metadata);
        window.close();
        
    }    
});