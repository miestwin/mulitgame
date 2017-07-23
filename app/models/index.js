function Game ({ id }) {
    this.id = id;
    this.started = false;
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