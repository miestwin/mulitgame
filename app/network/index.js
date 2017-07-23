const socketio = require('socket.io');
const { Game, Player } = require('../models');

module.exports = function (server) {
    var io = socketio.listen(server);

    io.sockets.on('connection', (socket) => {
        console.log(`New connection on socket: ${socket.id}`);
        
        socket.on('new-game', ({ id }) => {
            console.log(`Try assing new game with id ${id}`);
            socket.game = new Game({ id });
            socket.join('game-' + id);
            io.to(socket.id).emit('game-assigned-successful');
        });

        socket.on('new-player', () => {

        });

        socket.on('game-start', () => {
            socket.game.started = true;
            io.to('game-' + socket.game.id);
        });

        socket.on('update-game', () => {

        });

        socket.on('update-score', () => {

        });

        socket.on('game-end', () => {
            
        });

        socket.on('disconnect', () => {
            if (socket.player) socket.broadcast.to('game-' + socket.player.gameID).emit('played-disconnected'); 
        });
    });
}