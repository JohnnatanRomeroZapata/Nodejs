const path = require("path");

/*
    The path.dirname() method returns the directories of a file path.
    
    require.main.filename is great for figuring out the entry point for the current application.
*/

module.exports = path.dirname(require.main.filename); //--> get the directory from the main file, in this case app.js
