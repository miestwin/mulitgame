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
                if (socket.game) socket.broadcast.to('game-' + socket.game.id).emit('game-disconnected'); 
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
                if(socket.player) socket.broadcast.to('game-' + socket.player.gameId).emit('player-disconnected')
            });
        });

        socket.on('player-theme', ({ theme }) => {
            const confirm = !checkIfThemeIsInUse(socket.player.gameId, theme);
            if (confirm) {
                socket.player.theme = theme;
            }
            io.to(socket.id).emit('receive-confirmation', { confirm: confirm, theme: theme });
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

    const checkIfGameExist = (gameId) => {
        let exist = false;
        Object.keys(io.sockets.connected).forEach((socketID) => {
            if (io.sockets.connected[socketID].game && io.sockets.connected[socketID].game.id === gameId) {
                exist = true;
            }
        });
        return exist;
    };

    const checkIfThemeIsInUse = (gameId, theme) => {
        let inUse = false;
        Object.keys(io.sockets.connected).forEach((socketID) => {
            const player = io.sockets.connected[socketID].player;
            if (player && player.gameId === gameId && player.theme === theme) {
                inUse = true;
            }
        });
        return inUse;
    };

    const getAllPlayers = (id) => {
        const players = io.sockets.clients('game-' + id).filter((client) => client.player ? true : false);
        return players;
    };
}