const game = require('./game');
const controller = require('./controller');

module.exports = function (app) {
    app.use('/', game);
    app.use('/controller', controller);
}