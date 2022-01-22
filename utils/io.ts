import fs from 'fs'
import path from 'path'

/**
 * Here I used fs.promises.fn instead of fs.fnSync since the fnSync block the single thread loop while th IO operation is performed
 * while the fs.promises.fn version (e.g when reading a file), it does it in chunks allowing the event loop to serve other events..
 */

const storagePath = process.env.STORAGE_PATH;
const storageFile = process.env.STORAGE_FILE;
const resolvedStorageFilePath = path.resolve([storagePath, storageFile].join(path.sep));

export async function checkPathExistance() {
    const resolvedStoragePath = path.resolve(storagePath);

    try {
        await fs.promises.access(resolvedStoragePath)
    } catch (err) {
        await fs.promises.mkdir(resolvedStoragePath)
    }
}

export async function writeToFile(content) {
    await fs.promises.writeFile(resolvedStorageFilePath, content);
}

export async function appendToFile(content: string) {
    await fs.promises.appendFile(resolvedStorageFilePath, content);
}

export async function readFileContent() {
    try {
        const data = await fs.promises.readFile(resolvedStorageFilePath)

        return data.toString();
    } catch (err) {
        const initContent = '[]'
        appendToFile(initContent)

        return initContent
    }
}

module.exports = {
    writeToFile,
    readFileContent,
    checkPathExistance,
};