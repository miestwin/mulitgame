const socketio = require("socket.io");
const { Game, Player } = require("../models");
const MAX_PLAYERS = 6;
const TIME = 25;

module.exports = server => {
  var io = socketio.listen(server);

  io.sockets.on("connection", socket => {
    console.log(`New connection on socket: ${socket.id}`);

    socket.on("new-game", ({ id }) => {
      console.log(`Try assing new game with id ${id}`);
      socket.game = new Game({ id: id });
      socket.timerInterval = null;
      socket.timerSeconds = TIME;
      socket.join("game-" + id);
      io.to(socket.id).emit("game-assigned-successful");
      socket.on("disconnect", () => {
        if (socket.game)
          socket.broadcast
            .to("game-" + socket.game.id)
            .emit("game-not-available");
      });
    });

    socket.on("new-player", ({ id, gameId }) => {
      console.log(`Try assing new player with id ${id}`);
      const game = getGame(gameId);
      if (game) {
        if (!game.started) {
          if (numberOfPlayersInGame(gameId) < MAX_PLAYERS) {
            socket.player = new Player({
              id: id,
              gameId: gameId,
              socketID: socket.id
            });
            socket.join("game-" + gameId);
            io.to(socket.id).emit("player-assigned-successful");
          } else {
            io.to(socket.id).emit("game-full");
          }
        } else {
          io.to(socket.id).emit("game-already-started");
        }
      } else {
        io.to(socket.id).emit("game-not-available");
      }

      socket.on("disconnect", () => {
        if (socket.player) {
          console.log("disconnect");
          const characters = getCharactersInUse(socket.player.gameId);
          socket.broadcast
            .to("game-" + socket.player.gameId)
            .emit("update-character-selector", characters);
          socket.broadcast
            .to("game-" + socket.player.gameId)
            .emit("player-disconnected", socket.player);
          const numberOfPlayers = numberOfPlayersInGame(socket.player.gameId);
          if (numberOfPlayers === 0) {
            socket.broadcast
              .to("game-" + socket.player.gameId)
              .emit("no_connected_players");
          }
        }
      });
    });

    socket.on("set-player-character", character => {
      socket.player.character = character;
      const game = getGame(socket.player.gameId);
      if (!game) {
        io.to(socket.id).emit("game-not-available");
      } else if (numberOfPlayersInGame(socket.player.gameId) >= MAX_PLAYERS) {
        io.to(socket.id).emit("game-full");
      } else if (game.started) {
        io.to(socket.id).emit("game-already-started");
      } else {
        socket.broadcast
          .to("game-" + socket.player.gameId)
          .emit("update-character-selector", character);
        socket.broadcast
          .to("game-" + socket.player.gameId)
          .emit("update-players-state", socket.player);
      }
    });

    socket.on("get-characters-in-use", () => {
      const characters = getCharactersInUse(socket.player.gameId);
      io.to(socket.id).emit("update-character-selector", characters);
    });

    socket.on("start-timer", () => {
      socket.timerSeconds = TIME;
      socket.timerInterval = setInterval(() => {
        socket.timerSeconds -= 1;
        io
          .to("game-" + socket.game.id)
          .emit("update-timer", socket.timerSeconds);
        if (socket.timerSeconds <= 0) {
          clearInterval(socket.timerInterval);
          socket.game.started = true;
          io.to("game-" + socket.game.id).emit("start-game");
        }
      }, 1000);
    });

    socket.on("all-players", () => {
      io
        .to(socket.id)
        .emit("all-players", getAllPlayersForGame(socket.game.id));
    });

    socket.on("update-player-xy", (gameId, update) => {
      socket.broadcast
        .to("game-" + gameId)
        .emit("update-player-xy", socket.player.id, update);
    });

    socket.on("update-player-z", (gameId, update) => {
      socket.broadcast
        .to("game-" + gameId)
        .emit("update-player-z", socket.player.id, update);
    });

    socket.on("update_player_score", (playerId, socketId, score, vibration) => {
      const player = io.sockets.connected[socketId].player;
      if (player && player.id == playerId) {
        player.score = score;
        io.to(socketId).emit("update_player_score", score, vibration);
      }
    });

    socket.on("player_fire", gameId => {
      socket.broadcast
        .to("game-" + gameId)
        .emit("player_fire", socket.player.id);
    });

    socket.on("end-game", (gameId, playerId) => {
      socket.game.started = false;
      socket.broadcast.to("game-" + gameId).emit("end-game", playerId);
    });

    socket.on("play-again", gameId => {
      socket.broadcast.to("game-" + gameId).emit("play-again");
      socket.player.score = 0;
      socket.player.character = null;
    });
  });

  /**
     * Zwraca grę na podstawie podanego id gry
     * @param {*} gameId 
     */
  const getGame = gameId => {
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

  /**
     * Zwraca wykorzystywane postacie dla danej gry
     * @param {*} gameId 
     */
  const getCharactersInUse = gameId => {
    let characters = [];
    for (let socketID in io.sockets.connected) {
      if (io.sockets.connected.hasOwnProperty(socketID)) {
        const player = io.sockets.connected[socketID].player;
        if (player && player.gameId == gameId && player.character !== "") {
          characters.push(player.character);
        }
      }
    }
    return characters;
  };

  /**
     * Zwraca socket id dla danej gry
     * @param {*} gameId 
     */
  const findGameSocketID = gameId => {
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

  /**
     * Zwraca wszystkich graczy dla danej gry
     * @param {*} gameId 
     */
  const getAllPlayersForGame = gameId => {
    return Object.keys(io.sockets.connected).reduce((players, socketID) => {
      const player = io.sockets.connected[socketID].player;
      if (player && !players[player.id] && player.gameId == gameId) {
        players[player.id] = player;
      }
      return players;
    }, {});
  };

  /**
     * Zwraca liczbę graczy dla danej gry
     * @param {*} gameId 
     */
  const numberOfPlayersInGame = gameId => {
    return Object.keys(io.sockets.connected).reduce((count, socketID) => {
      const player = io.sockets.connected[socketID].player;
      if (player && player.gameId == gameId) count += 1;
      return count;
    }, 0);
  };
};
