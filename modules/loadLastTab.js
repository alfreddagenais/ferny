const saveFileToJsonFolder = require("../modules/saveFileToJsonFolder.js");
const ppath = require('persist-path')('Ferny');
const fs = require("fs");

function loadLastTab() {
    return new Promise(function(resolve, reject) {
        try {
            fs.readFile(ppath + "/json/lasttab.json", function(err, data) {
                resolve(data);
            });
        } catch (e) {
            saveFileToJsonFolder("lasttab", "overlay").then((bool) => {
                resolve("overlay");
            })
        }
    });
}

module.exports = loadLastTab;