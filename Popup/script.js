window.electronAPI.receive('currentLink', (message) => {
    console.log(message); // Prints 'Hello from the main process'
    document.getElementById("link").innerHTML = message;
});

// send downloads array here 
// map response into UI