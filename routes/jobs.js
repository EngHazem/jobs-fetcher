const express = require('express');
const router = express.Router();
const serverApi = require('../modules/unsplash.js');
const JobModel = require('../entities/Job');
const Image = require('../entities/Image')

router.route('/').get((req, resp) => {
    resp.json({
        data: {
            jobs: []
        },
        meta: {
            success: true,
            message: 'Jobs retrieved successfully!'
        }
    })
})
.post(async (req, res) => {
    const delay = 3/* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */
    const now = new Date();
    const runAt = new Date(now.getTime() + delay * 1000);
    
    function initJobFn() {
        return new Promise(resolve => {
            let job = JobModel.initJob();
            resolve(job);
        });
    }

    function delayedExec(job) {
        return new Promise(resolve => {
            setTimeout(() => {
                serverApi.photos
                .getRandom({ query: 'food'})
                .then(result => {
                    JobModel.updateJob(job.id, {...Image.create(result.response)}, 'PROCESSED')
                })
                .catch((err) => {
                    console.log('err', err);
                });
            }, delay * 1000);
        });
    }
    
    async function main() {
        try {
            let job = await initJobFn();
            await delayedExec(job);
        } catch (error) {
            console.error(error);
        }
        
        return job;
    }

    let job = await main();

    res.json({
        data: job.id,
        meta: {
            success: true,
            message: `Job will get executed at ${runAt}`
        }
    })
});

router.get('/:id', async (req, res) => {
    let job, ind;
    let response;
    try {
        job, ind = await JobModel.fetchJob(req.params.id);

        if(!job) {
            throw 'Job not found';
        }
        console.log('job', job);
        console.log('ind', ind);

        response = {
            data: job,
            meta: {
                success: true,
                message: 'Job retrieved successfully!'
            }
        };
    } catch (error) {
        console.error(error);

        response = {
            data: {},
            meta: {
                success: false,
                message: error
            }
        };
    }

    res.json(response);
})

module.exports = {
    jobRouter: router
}