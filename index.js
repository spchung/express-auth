const app = require('./app');
const http = require('http');
const config = require('./src/config/config');
const logger = require('./src/config/logger');

const server = http.Server(app);
const port = config.port || 3000;

server.listen(port, () => {
	logger.info(`App is listening on port ${port}`);
});