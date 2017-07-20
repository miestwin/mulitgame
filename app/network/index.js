const socketio = require('socket.io');
const { Game, Player } = require('../models');

module.exports = function (server) {
    var io = socketio.listen(server);

    io.sockets.on('connection', (socket) => {
        console.log(`New connection on socket: ${socket.id}`);
        
        socket.on('new-game', ({  }) => {
            
        });
    });
}