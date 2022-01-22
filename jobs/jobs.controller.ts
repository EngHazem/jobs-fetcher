import express, { Request, Response } from 'express';
import Image from '../images/image.interface';
import { checkPathExistance, readFileContent, writeToFile } from '../utils/io';
import { serverApi } from '../utils/unsplash';
import Job from './job.interface';

class JobsController {
    public path = '/jobs';
    public router = express.Router();
    public delay = 3 /* 5 + Math.ceil(Math.floor(Math.random() * 295) / 5) * 5 */;

    private job: Job;

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

    runAt = (): Date => {
        const now = new Date();
        const runAt = new Date(now.getTime() + this.delay * 1000);

        return runAt
    }

    /**
     * Delayed execution implementation
     */
    processJob = () => {
        // We could also create another endpoint to cancel a delayed execution by job id using clearTimeout()
        setTimeout(() => {
             serverApi.photos
                    .getRandom({
                        query: 'food'
                    })
                    .then(result => {
                        const {id,width,height,urls,color,description,alt_description,user} = <any>result.response;
                        const imageResponse = <Image>{id,width,height,urls,color,description,alt_description,user: {username: user.username, name: user.name}}

                        this.updateJob(imageResponse)
                    })
                    .catch((err) => {
                        console.error(err);

                        throw err
                    });
            }, this.delay * 1000);
    }

    /**
     * Creates a job and triggers the delayed execution
     */
    createJob = async () => {
        try {
            await this.initJob();
            this.processJob();
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
        await this.createJob();
        
        res.json({
            data: this.job,
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
    updateJob = async (data: Image) => {
        try {
            const content = await readFileContent();
            const jsonJobs = JSON.parse(content);

            const [myJob, myJobIndex] = await this.fetchJob(this.job.id, <Array<Job>>jsonJobs)

            if (typeof myJob != 'boolean' && typeof myJobIndex == 'number') {
                myJob.data = data;
                
                myJob.status = 'PROCESSED';
                jsonJobs[myJobIndex] = myJob
                this.job = myJob

                await writeToFile(JSON.stringify(jsonJobs));
            }
            else {
                throw Error(`Job with ID ${this.job.id} does not exist!`)
            }

        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Creates an initial Job Object
     */
    initJob = async () => {
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

        this.job = this.createNewJob();
        jobsList.unshift(this.job);

        try {
            await writeToFile(JSON.stringify(jobsList))
        } catch (error) {
            console.log('error', error);
        }
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
                const content = await readFileContent();
                jsonJobs = JSON.parse(content);
            }

            const myJobIndex = jsonJobs.findIndex(job => job.id === id);
            const myJob = <Job>jsonJobs[myJobIndex];

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