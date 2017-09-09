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
            socket.game = new Game({ id: id });
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
                        io.to(socket.id).emit('game-full');
                    }
                } else {
                    io.to(socket.id).emit('game-already-started');
                }
            } else {
                io.to(socket.id).emit('game-not-available');
            }

            socket.on('disconnect', () => {
                if(socket.player) {
                    socket.broadcast.to('game-' + socket.player.gameId).emit('player-disconnected', socket.player);
                }
            });
        });

        socket.on('set-player-character', ({ character }) => {
            const confirm = !checkIfCharacterIsInUse(socket.player.gameId, character);
            if (confirm) {
                socket.player.character = character;
                const allPlayersForGame = getAllPlayersForGame(socket.player.gameId);
                socket.broadcast.to('game-' + socket.player.gameId).emit('update-players-state', allPlayersForGame);
            }
            io.to(socket.id).emit('receive-confirmation', { confirm: confirm, character: character });
        });

        socket.on('game-start', () => {
            
        });

        socket.on('update-game', ({ position }) => {
            socket.player.position = position;
            socket.broadcast.to('game-' + socket.player.gameId).emit('update-game', {});
        });

        socket.on('update-score', ({ id, socketID, score }) => {
            const player = io.sockets.connected[socketID].player;
            if (player) player.score = score;
            io.to(player.socketID).emit('update-score', { score: player.score });
        });

        socket.on('game-end', () => {
            socket.broadcast.to('game-' + socket.game.id).emit('game-end');
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

    const checkIfCharacterIsInUse = (gameId, character) => {
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected.hasOwnProperty(socketID)) {
                const player = io.sockets.connected[socketID].player;
                if (player && player.gameId == gameId && player.character == character) {
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