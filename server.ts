import dotenv from 'dotenv';
dotenv.config();

import App from './app';
import JobController from './jobs/jobs.controller';
 
const app = new App(
  [
    new JobController(),
  ],
  3000,
);
 
app.listen();