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
        id: generateId(),
        status: 'PENDING',
        data: {}
    };
}

async function updateJob(id, data, status) {
    console.log('entered updateJob !!!');
    try {
        let content = await io.readFileContent();
        let jsonJobs = JSON.parse(content);

        let myJobIndex = jsonJobs.findIndex(job => job.id === id);
        let myJob = jsonJobs[myJobIndex];
        if (!myJob) {
            return false;
        }

        myJob.data = data;
        myJob.status = status;

        jsonJobs[myJobIndex] = myJob

        await io.writeToFile(JSON.stringify(jsonJobs));
    }
    catch (err) {
        console.error(err);
    }
}

async function initJob() {
    await io.checkPathExistance();

    let jobsList = await io.readFileContent();
    jobsList = JSON.parse(jobsList);

    let job = createNewJob();
    jobsList.unshift(job);

    await io.writeToFile(JSON.stringify(jobsList))

    return job
}

module.exports = {
    initJob,
    createNewJob,
    updateJob,
}