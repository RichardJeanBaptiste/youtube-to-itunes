const searchBtn = document.getElementById("searchBtn");
const linkInput = document.getElementById("yt-link");

searchBtn.addEventListener('click', () => {
    
    window.electronAPI.searchLink(linkInput.value);
});


  