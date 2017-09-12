function Game ({ id }) {
    this.id = id;
    this.started = false;
}

function Player ({ id, gameId, socketID }) {
    this.id = id;
    this.gameId = gameId;
    this.socketID = socketID;
    this.score = 0;
    this.character = '';
}

module.exports = {
    Game,
    Player
};