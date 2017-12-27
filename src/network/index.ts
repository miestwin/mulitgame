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

  public static newGame(data) {
    Network.socket.emit(actions.NEW_GAME, data);
  }

  public static newPlayer(data) {
    Network.socket.emit(actions.NEW_PLAYER, data);
  }

  public static setPlayerAvatar(data) {
    Network.socket.emit(actions.UPDATE_PLAYER_AVATAR, data);
  }

  public static getUsingAvatars(data) {
    Network.socket.emit(actions.USING_AVATARS, data);
  }

  public static updateScore(data) {
    Network.socket.emit(actions.UPDATE_SCORE, data);
  }

  public static gameStart(data) {
    Network.socket.emit(actions.GAME_START, data);
  }

  public static endGame(data) {
    Network.socket.emit(actions.GAME_END, data);
  }

  public static playerUpdate(data) {
    Network.socket.emit(actions.PLAYER_UPDATE, data);
  }

  public static resetGame(data) {
    Network.socket.emit(actions.GAME_RESET, data);
  }

  public static gameState(data) {
    Network.socket.emit(actions.GAME_STATE, data);
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

  public static onGameInvalid(fn: Function) {
    Network.socket.on(actions.GAME_INVALID, fn);
  }

  public static onUpdateGameState(fn: Function) {
    Network.socket.on(actions.UPDATE_GAME_STATE, fn);
  }

  public static onGameNotAvailable(fn: Function) {
    Network.socket.on(actions.GAME_NOT_AVAILABLE, fn);
  }

  public static onGameFull(fn: Function) {
    Network.socket.on(actions.GAME_FULL, fn);
  }

  public static onGameHasStarted(fn: Function) {
    Network.socket.on(actions.GAME_HAS_STARTED);
  }

  public static onPlayerJoined(fn: Function) {
    Network.socket.on(actions.PLAYER_JOINED, fn);
  }

  public static onUsingAvatars(fn: Function) {
    Network.socket.on(actions.USING_AVATARS, fn);
  }

  public static onUpdatePlayerAvatar(fn: Function) {
    Network.socket.on(actions.UPDATE_PLAYER_AVATAR, fn);
  }

  public static onUpdateScore(fn: Function) {
    Network.socket.on(actions.UPDATE_SCORE, fn);
  }

  public static onGameReset(fn: Function) {
    Network.socket.on(actions.GAME_RESET, fn);
  }
}
