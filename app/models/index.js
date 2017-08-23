function Game ({ id }) {
    this.id = id;
    this.started = false;
}

function Player ({ id, gameId, socketID }) {
    this.id = id;
    this.gameId = gameId;
    this.socketID = socketID;
    this.score = 0;
    this.theme = '';
}

module.exports = {
    Game,
    Player
};