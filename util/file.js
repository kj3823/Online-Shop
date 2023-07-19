const fs = require('fs');

const deleteFile = function (filePath) {
    fs.unlink(filePath, (err) => { //unlink deletes the file
        if (err) {
            throw next(err);
        }
    })
}
exports.deleteFile = deleteFile;