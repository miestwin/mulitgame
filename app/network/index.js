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
                const gameSocketID = findGameSocketID(socket.player.gameId);
                if (gameSocketID) {
                    const allPlayersForGame = getAllPlayersForGame(socket.player.gameId);
                    io.to(gameSocketID).emit('update-players-state', allPlayersForGame);
                }
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
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketID)) {
                const game = io.sockets.connected[socketID].game;
                if (game && game.id == gameId) {
                    return true;
                }
            }
        }
        return false;
    };

    const checkIfThemeIsInUse = (gameId, theme) => {
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketID)) {
                const player = io.sockets.connected[socketID].player;
                if (player && player.gameId == gameId && player.theme == theme) {
                    return true;
                }
            }
        }
        return false;
    };

    const findGameSocketID = (gameId) => {
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketID)) {
                const game = io.sockets.connected[socketID].game;
                if (game && game.id == gameId) {
                    return socketID;
                }                
            }
        }
        return null;
    };

    const getAllPlayersForGame = (gameId) => {
        return Object.keys(io.sockets.connected).reduce((players, socketID) => {
            const player = io.sockets.connected[socketID].player;
            if (player && player.gameId == gameId) {
                players[player.id] = player;
            }
            return players;
        }, {});
    };
}