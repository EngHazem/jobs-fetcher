const express = require('express');
const app = express();
const jobRouter = require('./routes/jobs').jobRouter
const rateLimit = require('express-rate-limit');

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

app.use('/jobs', limiter, jobRouter)

app.listen(3000)