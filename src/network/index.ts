import * as io from "socket.io-client";
import * as actions from "../../actions";

export default class Network {
  private static socket;

  public static connect() {
    Network.socket = io();
    Network.initialize();
  }

  private static initialize() {
    Network.socket.on("disconnect", () => {
      document.location.reload();
    });
  }

  public static removeListener(listener: string) {
    Network.socket.off(listener);
  }

  public static newGame(id) {
    Network.socket.emit(actions.NEW_GAME, { id });
  }

  public static updateScore(playerId, socketId, score, vibration) {
    Network.socket.emit(actions.UPDATE_SCORE, {
      playerId,
      socketId,
      score,
      vibration
    });
  }

  public static endGame(gameId, playerId) {
    Network.socket.emit(actions.GAME_END, { gameId, playerId });
  }

  public static onGameStart(fn: Function) {
    Network.socket.on(actions.GAME_START, fn);
  }

  public static onPlayerUpdate(fn: Function) {
    Network.socket.on(actions.PLAYER_UPDATE, fn);
  }

  public static onEndGame(fn: Function) {
    Network.socket.on(actions.GAME_END, fn);
  }
}
