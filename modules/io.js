const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Here I used fs.promises.fn instead of fs.fnSync since the fnSync block the single thread loop while th IO operation is performed
 * while the fs.promises.fn version (e.g when reading a file), it does it in chunks allowing the event loop to serve other events..
 */

const storagePath = process.env.STORAGE_PATH;
const storageFile = process.env.STORAGE_FILE;
const resolvedStorageFilePath = path.resolve([storagePath, storageFile].join(path.sep));

async function checkPathExistance() {
    let resolvedStoragePath = path.resolve(storagePath);

    try {
        await fs.promises.access(resolvedStoragePath)
    } catch (err) {
        await fs.promises.mkdir(resolvedStoragePath)
    }
}

async function writeToFile(content) {
    await fs.promises.writeFile(resolvedStorageFilePath, content, err => {
        if (err) {
            console.error(err)
            return false;
        }

        return true;
    });
}

async function appendToFile(content) {
    await fs.promises.appendFile(resolvedStorageFilePath, content, err => {
        if (err) {
            console.error(err)
            return false;
        }

        return true;
    });
}

async function readFileContent() {
    try {
        const data = await fs.promises.readFile(resolvedStorageFilePath)

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
};