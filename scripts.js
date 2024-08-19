const searchBtn = document.getElementById("link_btn");

searchBtn.addEventListener('click', async () => {
    let text = await navigator.clipboard.readText();
    console.log(text);
    //window.electronAPI.searchLink(text);
    window.electronAPI.quickDownload(text);
});

const testBtn = document.getElementById("back");

testBtn.addEventListener('click', () => {
    console.log("abcdefg")
})




  