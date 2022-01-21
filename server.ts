import express from 'express';
const app = express();
import rateLimit from 'express-rate-limit';

import dotenv from 'dotenv';
import jobs from './routes/jobs';
dotenv.config();

const limiter = rateLimit({
	windowMs: 1000,
	max: 2,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(express.static('public'))

app.get('/', (req, resp) => {
    resp.render('index');
})


const port = 3000;
const host = 'localhost'
app.use(limiter);
jobs(app);

app.listen(port, host, () => {
	console.log(`Listening to http://${host}:${port}...`);
})