const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const schedule = require('node-schedule');
const serverApi = require('../modules/unsplash.js');
const JobModel = require('../entities/Job');

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
    const delay = 5/* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */
    const now = new Date();
    const runAt = new Date(now.getTime() + delay * 1000);
    
    try {
        JobModel.initJob().then(job => {
            console.log('job', job);
            schedule.scheduleJob(runAt, async () => {
                console.log('gonna execute serverApi.photos...');
                serverApi.photos
                    .getRandom({ query: 'food'})
                    .then(async result => {
                        await JobModel.updateJob(job, {...result.response}, 'PROCESSED')
                    })
                    .catch(() => {
                        console.log('something went wrong!');
                });
            });
        });
    } catch (error) {
        console.log('error', error);
    }

    res.json({
        data: {
            jobs: []
        },
        meta: {
            success: true,
            message: `Job will get executed at ${runAt}`
        }
    })
});

router.get('/create', (req, res) => {
    res.render('jobs/create');
})

module.exports = {
    jobRouter: router
}