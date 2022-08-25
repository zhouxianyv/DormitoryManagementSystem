const fs = require('fs');

function createHtml(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, function(err) {
            if(err) {
                reject(false);
                return console.log(err);
            }
            resolve(true);
            console.log("The file was saved!");
        });
    });
}

function readHtml(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function(err, data) {
            if(err) {
                resolve(false);
                return console.log(err);
            }
            resolve(data.toString());
            console.log("The file was saved!");
        });
    });
}

module.exports = {
    createHtml,
    readHtml
};
