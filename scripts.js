const searchBtn = document.getElementById("search_btn");

searchBtn.addEventListener('click', async () => {
    let text =  await navigator.clipboard.readText();
    window.electronAPI.searchLink(text);
});


  