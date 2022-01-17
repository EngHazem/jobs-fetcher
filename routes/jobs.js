const express = require('express');
const router = express.Router();
const schedule = require('node-schedule');
const serverApi = require('../modules/unsplash.js')
const saveToFile = require('../modules/io').saveToFile;

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
.post((req, res, next) => {
    const delay = 1/* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */
    const now = new Date();
    const runAt = new Date(now.getTime() + delay * 1000);

    const job = schedule.scheduleJob(runAt, function(){
        serverApi.photos
            .getRandom({ query: 'food'})
            .then((result) => {
                console.log('new job', saveToFile());
            })
            .catch(() => {
                console.log('something went wrong!');
        });
    });

    res.json({
        data: {
            jobs: []
        },
        meta: {
            success: true,
            message: `Job will get executed at ${runAt}`
        }
    })
})

router.get('/create', (req, res) => {
    res.render('jobs/create');
})

module.exports = {
    jobRouter: router
}