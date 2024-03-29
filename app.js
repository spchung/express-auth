const express = require('express');
const app = express();
const logger = require('./src/config/logger');

app.use(express.static('public'))

app.get('/', (req, res) => {
    logger.info('GET /');
    res.status(200).sendFile('index.html'); 
});

// app.post
const routes = require('./src/routes/v1');
app.use('/v1', routes)

module.exports = app;