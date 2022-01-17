const express = require('express');
const app = express();
const jobRouter = require('./routes/jobs').jobRouter

app.use(express.static('public'))

app.set('view engine', 'ejs');
app.get('/', (req, resp) => {
    resp.render('index');
})

app.use('/jobs', jobRouter)

function logger (req, resp, next) {
    console.log('originalUrl', req.originalUrl);
    next();
}



app.listen(3000)