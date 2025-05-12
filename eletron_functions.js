const  { shell } = require('electron');

function openFile(filePath) {
  shell.openPath(filePath)
    .then((result) => {
      if (result === '') {
        console.log(`Successfully opened: ${filePath}`);
      } else {
        console.error(`Failed to open: ${filePath} with error code: ${result}`);
      }
    })
    .catch((err) => {
      console.error('Error opening file:', err);
    });
};

module.exports = { openFile };