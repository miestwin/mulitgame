const express = require('express');
const config = require('./config');
const app = express();

const server = require('http').createServer(app);

app.use(express.static(__dirname + '/dist'));

require('./app/routing')(app);

require('./app/network')(server);

if (require.main === module) {
    server.listen(config.port, () => {
        console.log(`Listening on ${config.port}`);
    });
}

