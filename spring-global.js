#!/usr/bin/env node
const fs = require('fs')
let jsonClass = require('./resources/struct.json')
const path = require('path');
// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

// Retrieve the first argument
var name = args[0];


if (name === "model") {
    fs.writeFile("./struct.json", JSON.stringify(jsonClass, null, 2), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

if (name === "stack") { 
    var myLibrary = require('./index.js');
}

console.log(name, "Este es el nombre")

// Displays the text in the console
// myLibrary.say('Se genero los datos con exito');