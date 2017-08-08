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

        socket.on('new-player', ({ id, gameId }) => {
            console.log(`Try assing new player with id ${id}`);
            socket.player = new Player({ id, gameId });
            socket.join('game-' + gameId);
            io.to(socket.id).emit('player-assigned-successful');
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
            console.log('disconnected');
            if (socket.player) socket.broadcast.to('game-' + socket.player.gameId).emit('played-disconnected');
            if (socket.game) socket.broadcast.to('game-' + socket.game.id).emit('game-disconnected'); 
        });
    });
}