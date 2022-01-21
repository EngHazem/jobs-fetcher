const express = require('express');
const router = express.Router();
const serverApi = require('../modules/unsplash.js');
const JobModel = require('../entities/Job');
const Image = require('../entities/Image');

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
        const delay = 3 /* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */
        const now = new Date();
        const runAt = new Date(now.getTime() + delay * 1000);

        function initJobFn() {
            return new Promise(resolve => {
                let job = JobModel.initJob();
                resolve(job);
            });
        }

        function delayedExec(job) {
            // We could also create another endpoint to cancel a delayed execution by job id using clearTimeout
            return new Promise(resolve => {
                resolve(setTimeout(() => {
                    serverApi.photos
                        .getRandom({
                            query: 'food'
                        })
                        .then(result => {
                            console.log('result', result);
                            JobModel.updateJob(job.id, {
                                ...Image.create(result.response)
                            }, 'PROCESSED')
                        })
                        .catch((err) => {
                            throw err
                        });
                }, delay * 1000));
            });
        }


        async function main() {
            try {
                let job = await initJobFn();
                await delayedExec(job);

                return job;
            } catch (err) {
                console.error(err.message);
            }
        }

        let job = await main();

        res.json({
            data: job,
            meta: {
                success: true,
                message: `Job will get executed at ${runAt}`
            }
        });
    });

router.get('/:id', async (req, res) => {
    let response = {
        data: {},
        meta: {
            success: false,
            message: ''
        }
    };

    try {
        let [job, _] = await JobModel.fetchJob(req.params.id);

        if (!job) {
            throw new Error('Job not found');
        }

        response.data = job,
        response.meta.success = true;
        response.meta.message = job.status == 'PROCESSED' ? 'Job retrieved successfully!' : 'Job retireved but still pending unsplash image fetching.'
    } catch (err) {
        response.meta.message = err.message
        console.error(err);
    }

    res.json(response);
})

module.exports = {
    jobRouter: router
}