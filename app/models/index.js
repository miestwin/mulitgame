function Game ({ id, socketID }) {
    this.id = id;
    this.socketID = socketID;
    this.started = false;
}

function Player ({ id, gameId, socketID }) {
    this.id = id;
    this.gameId = gameId;
    this.socketID = socketID;
    this.score = 0;
    this.theme = '';
    this.position = null;
}

module.exports = {
    Game,
    Player
};