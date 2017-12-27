const express = require("express");
const socketio = require("socket.io");
const config = require("./config");
const actions = require("./actions");
const app = express();

const MAX_PLAYERS = 4;
var currentGames = {};

const server = require("http").createServer(app);

app.use(express.static(__dirname + "/dist"));

require("./routing")(app);

var io = socketio.listen(server);

io.sockets.on("connection", socket => {
  console.log(
    "New connection from " +
      socket.handshake.address +
      " on socket " +
      socket.id
  );

  socket.on(actions.NEW_GAME, data => {
    createNewGame(socket, data.gameId, data.name);
  });

  socket.on(actions.NEW_PLAYER, data => {
    assignNewPlayer(
      socket,
      data.playerId,
      data.gameId,
      data.avatar ? data.avatar : null,
      data.name ? data.name : null
    );
  });

  socket.on(actions.PLAYER_UPDATE, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    if (!currentGames[data.gameId].players[data.playerId]) {
      kickClient(socket);
      return false;
    }
    socket.broadcast
      .to("game-" + data.gameId)
      .emit(actions.PLAYER_UPDATE, data);
  });

  socket.on(actions.UPDATE_SCORE, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    if (currentGames[data.gameId].players[data.playerId]) {
      currentGames[data.gameId].players[data.playerId].score = data.score;
      io
        .to(currentGames[data.gameId].players[data.playerId].socketId)
        .emit(actions.UPDATE_SCORE);
    }
  });

  socket.on(actions.UPDATE_PLAYER_AVATAR, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    currentGames[data.gameId].players[data.playerId].avatar = data.avatar;
    socket.broadcast
      .to("game-" + data.gameId)
      .emit(actions.UPDATE_PLAYER_AVATAR, data.avatar);
    io
      .to(currentGames[data.gameId].viewer)
      .emit(actions.UPDATE_GAME_STATE, currentGames[data.gameId]);
  });

  socket.on(actions.GAME_START, function(data) {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    currentGames[data.gameId].started = true;
    socket.broadcast.to("game-" + data.gameId).emit(actions.GAME_START);
  });

  socket.on(actions.GAME_GET_READY, function(data) {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    socket.broadcast.to("game-" + data.gameId).emit(actions.GAME_GET_READY);
  });

  socket.on(actions.GAME_RESET, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    currentGames[data.gameId].started = false;
    socket.broadcast.to("game-" + data.gameId).emit(actions.GAME_RESET);
  });

  socket.on(actions.GAME_END, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    // todo: wyliczyć najwyższy wynik i zapisać do pliku dla danej gry
    socket.broadcast
      .to("game-" + data.gameId)
      .emit(actions.GAME_END, data.playerId);
  });

  socket.on(actions.UPDATE_GAME_STATE, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    socket.broadcast
      .to("game-" + data.gameId)
      .emit(actions.UPDATE_GAME_STATE, data);
  });

  socket.on(actions.GAME_STATE, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    socket.broadcast.to("game-" + data.gameId).emit(actions.GAME_STATE, data);
  });

  socket.on(actions.USING_AVATARS, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
    const avatars = [];
    for (let player in currentGames[data.gameId].players) {
      if (player.avatar) {
        avatars.push(player.avatar);
      }
    }
    io.to(socket.id).emit(actions.USING_AVATARS, avatars);
  });

  socket.on(actions.USING_NAMES, data => {
    if (!verifyGameRoom(data.gameId)) {
      kickClient(socket);
      return false;
    }
  });
});

if (require.main === module) {
  server.listen(config.port, () => {
    console.log(`Listening on ${config.port}`);
  });
}

function createNewGame(socket, id, name) {
  console.log("Game identified as " + socket.id + " using id " + id);

  currentGames[id] = {};
  currentGames[id].id = id;
  currentGames[id].viewer = socket.id;
  currentGames[id].name = name;
  currentGames[id].players = {};
  currentGames[id].started = false;

  socket.join("game-" + id);

  io.to(socket.id).emit(actions.UPDATE_GAME_STATE, currentGames[id]);

  socket.on("disconnect", () => {
    console.log(
      "Game on socket " + socket.id + " and id " + id + " disconnected"
    );
    socket.broadcast.to("game-" + id).emit(actions.GAME_INVALID);
    delete currentGames[id];
  });
}

function assignNewPlayer(socket, id, gameId, avatar, name) {
  console.log(
    "New player entered game " +
      socket.id +
      " using id " +
      id +
      " and gameId " +
      gameId
  );

  if (!verifyGameRoom(gameId)) {
    io.to(socket.id).emit("game-not-available");
    return false;
  }

  if (currentGames[gameId].players[id]) {
    return false;
  }

  if (currentGames[gameId].started) {
    io.to(socket.id).emit(actions.GAME_HAS_STARTED);
    return false;
  }

  var playerCount = 0;
  for (var ii in currentGames[gameId].players) {
    playerCount++;
  }
  if (playerCount >= MAX_PLAYERS) {
    io.to(socket.id).emit(actions.GAME_FULL);
    return false;
  }

  socket.join("game-" + gameId);

  currentGames[gameId].players[id] = {
    id: id,
    socketId: socket.id,
    avatar: avatar,
    name: name,
    score: 0
  };

  io.to(socket.id).emit(actions.PLAYER_JOINED);
  io
    .to(currentGames[gameId].viewer)
    .emit(actions.UPDATE_GAME_STATE, currentGames[gameId]);

  socket.on("disconnect", () => {
    console.log(
      "Player on socket " + socket.id + " and id " + id + " disconnected"
    );
    delete currentGames[gameId].players[id];
    var count = 0;
    for (var ii in currentGames[gameId].players) {
      count++;
    }
    if (count < 1) {
      socket.broadcast.to("game-" + gameId).emit(actions.GAME_END);
    } else {
      socket.broadcast
        .to("game-" + data.gameId)
        .emit(actions.UPDATE_PLAYER_AVATAR);
      io
        .to(currentGames[gameId].viewer)
        .emit(actions.UPDATE_GAME_STATE, currentGames[gameId]);
    }
  });
}

function verifyGameRoom(id) {
  if (!currentGames[id]) {
    return false;
  }
  return true;
}

function kickClient(socket) {
  console.log("Client kicked " + socket.id);
  io.to(socket.id).emit(actions.GAME_INVALID);
  socket.disconnect();
}
