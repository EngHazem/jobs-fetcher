const fs = require('fs');
const path = require('path');
const createNewJob = require('../entities/Job');
const dotenv = require('dotenv');
const {
    createInflate
} = require('zlib');
dotenv.config();

const storagePath = process.env.STORAGE_PATH;
const storageFile = process.env.STORAGE_FILE;
const resolvedStorageFilePath = path.resolve([storagePath, storageFile].join(path.sep));

async function checkPathExistance() {
    let resolvedStoragePath = path.resolve(storagePath);

    try {
        await fs.accessSync(resolvedStoragePath)
    } catch (err) {
        await fs.mkdirSync(resolvedStoragePath)
    }
}

async function writeToFile(content) {
    await fs.writeFileSync(resolvedStorageFilePath, content, err => {
        if (err) {
            console.error(err)
            return false;
        }

        return true;
    });
}

async function appendToFile(content) {
    await fs.appendFileSync(resolvedStorageFilePath, content, err => {
        if (err) {
            console.error(err)
            return false;
        }

        return true;
    });
}

async function readFileContent() {
    try {
        const data = await fs.readFileSync(resolvedStorageFilePath)

        return data.toString();
    } catch (err) {
        let initContent = '[]'
        appendToFile(initContent)

        return initContent
    }
}

module.exports = {
    writeToFile,
    readFileContent,
    checkPathExistance,
    appendToFile,
};