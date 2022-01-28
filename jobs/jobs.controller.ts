import express, { Request, Response, Router } from 'express';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { Basic as Image } from "unsplash-js/dist/methods/photos/types";
import { checkPathExistance, readFileContent, writeToFile } from '../utils/io';
import { serverApi } from '../utils/unsplash';
import Job from './job.interface';

class JobsController {
    public path = '/jobs';
    public router: Router = express.Router();
    public delay: number;

    constructor() {
        this.intializeRoutes();
    }

    /**
     * Initialize controller related routes
     */
    public intializeRoutes() {
        this.router.post('/jobs', this.handleJobPost);
        this.router.get('/jobs/:id', this.handleGetJob);
    }

    /**
     * Generates an ID conststing of random strings
     * @param length size of the ID
     * @returns ID
     */
    generateId = (length = 5) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        return result;
    }

    /**
     * Resets the delay time
     */
    resetDelay = () => {
        this.delay = 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5;
    }
    
    /**
     * Returns the time at wthich a job is going to be processed
     * @returns DateTime
     */
    runAt = (): Date => {
        const now = new Date();
        const runAt = new Date(now.getTime() + this.delay * 1000);

        return runAt
    }

    /**
     * Delayed execution implementation
     */
    processJob = (job: Job) => {
        // We could also create another endpoint to cancel a delayed execution by job id using clearTimeout()
        setTimeout(() => {
             serverApi.photos
                    .getRandom({
                        query: 'food'
                    })
                    .then(result => {
                        const {alt_description, blur_hash ,color ,description ,height ,likes ,links ,promoted_at, width} = <Random>result.response;
                        const imageResponse = <Image>{alt_description, blur_hash ,color ,description ,height ,likes ,links ,promoted_at, width}

                        this.updateJob(job, imageResponse)
                    })
                    .catch((err) => {
                        // We can set the job status to FAILED in case unsplash fetching failure.
                        console.error(err);

                        throw err
                    });
            }, this.delay * 1000);
    }

    /**
     * Creates a job and triggers the delayed execution
     */
    createJob = async (): Promise<Job> => {
        try {
            const job: Job = await this.initJob();
            this.processJob(job);

            return job
        } catch (err) {
            console.error(err.message);
        }
    }

    /**
     * Job creation request handler
     * @param req 
     * @param res 
     */
    handleJobPost = async (req: Request, res: Response) => {
        this.resetDelay();

        const job = await this.createJob();
        
        res.json({
            data: job,
            meta: {
                success: true,
                message: `Job will get executed at ${this.runAt()}`
            }
        });
    }

    /**
     * Creates a job template object
     * @returns Job
     */
    createNewJob = (): Job => {
        return <Job>{
            id: this.generateId(8),
            status: 'PENDING',
            data: {}
        };
    }

    /**
     * Updates the stored Job
     * @param data 
     */
    updateJob = async (job: Job, data: Image) => {
        try {
            const content = await readFileContent();
            const jsonJobs: Job[] = JSON.parse(content);

            const [myJob, myJobIndex] = await this.fetchJob(job.id, jsonJobs)

            if (typeof myJob !== 'boolean' && typeof myJobIndex == 'number') {
                myJob.data = data;
                
                myJob.status = 'PROCESSED';
                jsonJobs[myJobIndex] = myJob
                job = myJob

                await writeToFile(JSON.stringify(jsonJobs));
            }
            else {
                throw Error(`Job with ID ${job.id} does not exist!`)
            }

        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Creates an initial Job Object
     */
    initJob = async (): Promise<Job> => {
        let jobsList: string;

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
        const jobsListJSON: Job[] = JSON.parse(jobsList);

        const job: Job = this.createNewJob();
        jobsListJSON.unshift(job);

        try {
            await writeToFile(JSON.stringify(jobsListJSON))
        } catch (error) {
            console.log('error', error);
        }

        return job
    }

    /**
     * Gets the job from storage and returns in response
     * @param req 
     * @param res 
     */
    handleGetJob = async (req: Request<{ id: string }>, res: Response) => {
        const response = {
            data: {},
            meta: {
                success: false,
                message: ''
            }
        };

        try {
            const [job] = await this.fetchJob(req.params.id);
            if (typeof job != 'boolean') {                
                response.data = job;
                response.meta.success = true;
                response.meta.message = job.status == 'PROCESSED' ? 'Job retrieved successfully!' : 'Job retireved but still pending unsplash image fetching.'
            }
            else {
                throw new Error('Job not found');
            }
        } catch (err) {
            response.meta.message = err.message
            console.error(err);
        }

        res.json(response);
    };

    /**
     * Fetches the Job from the file storage OR from a provided Jobs resource
     * @param id 
     * @param jsonJobs 
     * @returns Promise
     */
    fetchJob = async (id: string, jsonJobs?: Job[]): Promise<[Job | boolean, number | boolean]> => {
        try {
            await checkPathExistance();

            if (!jsonJobs) {
                const content: string = await readFileContent();
                jsonJobs = JSON.parse(content);
            }

            const myJobIndex = jsonJobs.findIndex(job => job.id === id);
            const myJob = jsonJobs[myJobIndex];

            if (!myJob) {
                return [false, false];
            }

            return [myJob, myJobIndex];
        } catch (error) {
            console.log('error', error);

            return [false, false];
        }
    }
}

export default JobsController;