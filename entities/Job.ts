import {readFileContent, writeToFile, checkPathExistance} from '../modules/io'

export function generateId(length = 5) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function createNewJob() {
    return {
        id: generateId(8),
        status: 'PENDING',
        data: {}
    };
}

export async function updateJob(id, data, status) {
    try {
        const content = await readFileContent();
        const jsonJobs = JSON.parse(content);

        const [myJob, myJobIndex] = await fetchJob(id, jsonJobs)

        myJob.data = data;
        myJob.status = status;

        jsonJobs[myJobIndex] = myJob

        await writeToFile(JSON.stringify(jsonJobs));
    } catch (err) {
        console.error(err);
    }
}

export async function initJob() {
    let jobsList;

    try {
        await checkPathExistance();
    } catch (error) {
        console.log('error', error);
    }

    try {
        jobsList = await readFileContent();
    } catch (error) {
        console.log('error', error);
    }
    jobsList = JSON.parse(jobsList);

    const job = createNewJob();
    jobsList.unshift(job);

    try {
        await writeToFile(JSON.stringify(jobsList))
    } catch (error) {
        console.log('error', error);
    }

    return job
}

export async function fetchJob(id, jsonJobs = null) {
    try {
        await checkPathExistance();

        if (!jsonJobs) {
            const content = await readFileContent();
            jsonJobs = JSON.parse(content);
        }
    } catch (error) {
        console.log('error', error);
    }

    const myJobIndex = jsonJobs.findIndex(job => job.id === id);
    const myJob = jsonJobs[myJobIndex];
    if (!myJob) {
        return [false, false];
    }

    return [myJob, myJobIndex];
}

module.exports = {
    initJob,
    createNewJob,
    updateJob,
    fetchJob,
}