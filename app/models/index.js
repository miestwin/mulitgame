function Game ({ id }) {
    this.id = id;
    this.started = false;
}

function Player ({ id, gameId }) {
    this.id = id;
    this.gameId = gameId;
    this.score = 0;
    this.theme = '';
    this.position = null;
}

module.exports = {
    Game,
    Player
};