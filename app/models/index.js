function Game ({ socketId, gameRoom }) {
    this.socketId = socketId;
    this.gameRoom = gameRoom;
    this.started = false;
    this.players = {};
}

function Player ({ socketId, nick, gameRoom }) {
    this.socketId = socketId;
    this.nick = nick;
    this.gameRoom = gameRoom;
    this.score = 0;
}

module.exports = {
    Game,
    Player
};