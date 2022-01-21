const io = require("../modules/io");

function generateId(length = 5) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function createNewJob() {
    return {
        id: generateId(8),
        status: 'PENDING',
        data: {}
    };
}

async function updateJob(id, data, status) {
    try {
        let content = await io.readFileContent();
        let jsonJobs = JSON.parse(content);

        let [myJob, myJobIndex] = await fetchJob(id, jsonJobs)

        myJob.data = data;
        myJob.status = status;

        jsonJobs[myJobIndex] = myJob

        await io.writeToFile(JSON.stringify(jsonJobs));
    } catch (err) {
        console.error(err);
    }
}

async function initJob() {
    let jobsList;

    try {
        await io.checkPathExistance();
    } catch (error) {
        console.log('error', error);
    }

    try {
        jobsList = await io.readFileContent();
    } catch (error) {
        console.log('error', error);
    }
    jobsList = JSON.parse(jobsList);

    let job = createNewJob();
    jobsList.unshift(job);

    try {
        await io.writeToFile(JSON.stringify(jobsList))
    } catch (error) {
        console.log('error', error);
    }

    return job
}

async function fetchJob(id, jsonJobs = null) {
    try {
        await io.checkPathExistance();

        if (!jsonJobs) {
            let content = await io.readFileContent();
            jsonJobs = JSON.parse(content);
        }
    } catch (error) {
        console.log('error', error);
    }

    let myJobIndex = jsonJobs.findIndex(job => job.id === id);
    let myJob = jsonJobs[myJobIndex];
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