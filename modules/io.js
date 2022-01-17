const fs = require('fs');
const path = require('path');
const createNewJob = require('../entities/Job');
const dotenv = require('dotenv');
dotenv.config();

const storageFile = process.env.STORAGE_PATH;
const resolvedStorageFile = path.resolve(storageFile);

function checkFileExistance() {

    fs.access(storageFile, fs.F_OK, (err) => {
        if (err) {
            fs.writeFile(resolvedStorageFile, '', er => {
                if (er) {
                    console.error('er', er)
                    return ''
                }
            })
        }
    })
}

function saveToFile() {
    let job = createNewJob();

    checkFileExistance();
    
    fs.readFile(resolvedStorageFile, 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
    })

    return job;
}

module.exports = {
    saveToFile
}