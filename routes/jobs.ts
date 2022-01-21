import { Express, Request, Response } from 'express';
import create from '../entities/Image';
import { fetchJob, initJob, updateJob } from '../entities/Job';
import { serverApi } from '../modules/unsplash';

export default function (app: Express) {
    app.use('/jobs', () => {
        app.route('/')
            .get((req: Request, resp: Response) => {
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
            .post(async (req: Request, res: Response) => {
                const delay = 3 /* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */
                const now = new Date();
                const runAt = new Date(now.getTime() + delay * 1000);

                function initJobFn() {                    
                    return new Promise(resolve => {
                        const job = initJob();
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
                                    updateJob(job.id, {
                                        ...create(result.response)
                                    }, 'PROCESSED')
                                })
                                .catch((err) => {
                                    console.error(err);
                                    
                                    throw err
                                });
                        }, delay * 1000));
                    });
                }

                async function main() {
                    try {
                        const job = await initJobFn();
                        await delayedExec(job);

                        return job;
                    } catch (err) {
                        console.error(err.message);
                    }
                }

                const job = await main();

                res.json({
                    data: job,
                    meta: {
                        success: true,
                        message: `Job will get executed at ${runAt}`
                    }
                });
            });

        app.get('/:id', async (req, res) => {
            const response = {
                data: {},
                meta: {
                    success: false,
                    message: ''
                }
            };

            try {
                const [job, _] = await fetchJob(req.params.id);

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
    })

}