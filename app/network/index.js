const socketio = require('socket.io');
const _ = require('lodash');
const { Game, Player } = require('../models');
const MAX_PLAYERS = 4;

module.exports = (server) => {
    var io = socketio.listen(server);

    io.sockets.on('connection', (socket) => {
        console.log(`New connection on socket: ${socket.id}`);
        
        socket.on('new-game', ({ id }) => {
            console.log(`Try assing new game with id ${id}`);
            socket.game = new Game({ id: id, socketID: socket.id});
            socket.join('game-' + id);
            io.to(socket.id).emit('game-assigned-successful');
            socket.on('disconnect', () => {
                if (socket.game) socket.broadcast.to('game-' + socket.game.id).emit('game-disconnected'); 
            });
        });

        socket.on('new-player', ({ id, gameId }) => {
            console.log(`Try assing new player with id ${id}`);
            const game = getGame(gameId);
            if (game) {
                if (!game.started) {
                    if (numberOfPlayersInGame(gameId) < MAX_PLAYERS) {
                        socket.player = new Player({ id: id, gameId: gameId, socketID: socket.id });
                        socket.join('game-' + gameId);
                        io.to(socket.id).emit('player-assigned-successful');
                    } else {
                        io.to(socket.id).emit('game-not-available', { codeError: 3});
                    }
                } else {
                    io.to(socket.id).emit('game-not-available', { codeError: 2});
                }
            } else {
                io.to(socket.id).emit('game-not-available', { codeError: 1});
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

    const getGame = (gameId) => {
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketID)) {
                const game = io.sockets.connected[socketID].game;
                if (game && game.id == gameId) {
                    return game;
                }
            }
        }
        return null;
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

    const numberOfPlayersInGame = (gameId) => {
        return Object.keys(io.sockets.connected).reduce((count, socketID) => {
            const player = io.sockets.connected[socketID].player;
            if (player && player.gameId == gameId) count +=1;
            return count;
        }, 0);
    }
}