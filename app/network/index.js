const socketio = require('socket.io');
const _ = require('lodash');
const { Game, Player } = require('../models');

module.exports = (server) => {
    var io = socketio.listen(server);

    io.sockets.on('connection', (socket) => {
        console.log(`New connection on socket: ${socket.id}`);
        
        socket.on('new-game', ({ id }) => {
            console.log(`Try assing new game with id ${id}`);
            socket.game = new Game({ id });
            socket.join('game-' + id);
            io.to(socket.id).emit('game-assigned-successful');

            socket.on('disconnect', () => {
                socket.broadcast.to('game-' + socket.game.id).emit('game-disconnected'); 
            });
        });

        socket.on('new-player', ({ id, gameId }) => {
            console.log(`Try assing new player with id ${id}`);
            if (checkIfGameExist(gameId)) {
                socket.player = new Player({ id, gameId });
                socket.join('game-' + gameId);
                io.to(socket.id).emit('player-assigned-successful');
            } else {
                io.to(socket.id).emit('game-not-available');
            }

            socket.on('disconnect', () => {
                socket.broadcast.to('game-' + socket.player.gameId).emit('played-disconnected');
            });
        });

        socket.on('game-start', () => {
            socket.game.started = true;
            console.log(getAllPlayers());
            //io.to('game-' + socket.game.id);
        });

        socket.on('update-game', () => {

        });

        socket.on('update-score', () => {

        });

        socket.on('game-end', () => {
            
        });
    });

    const checkIfGameExist = (id) => {
        let exist = false;
        Object.keys(io.sockets.connected).forEach((socketID) => {
            if (io.sockets.connected[socketID].game && io.sockets.connected[socketID].game.id === id) {
                exist = true;
            }
        });
        return exist;
    };

    const getAllPlayers = (id) => {
        const players = io.sockets.clients('game-' + id).filter((client) => client.player ? true : false);
        return players;
    }
}