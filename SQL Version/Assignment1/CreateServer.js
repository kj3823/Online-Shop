const http = require('http');

const routingInfo = require('./routes')

const server = http.createServer(routingInfo.Handler);

server.listen(3000);