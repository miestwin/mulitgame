import * as io from 'socket.io-client';

/**
 * Połączenie z serwerem
 * @export
 * @class Network
 */
export default class Network {
    private static socket;

    public static NEW_PLAYER = 'new-player';
    public static SET_PLAYER_CHARACTER = 'set-player-character';
    public static GET_CHARACTERS_IN_USE = 'get-characters-in-use';
    public static GAME_NOT_AVAILABLE = 'game-not-available';
    public static GAME_FULL = 'game-full';
    public static GAME_ALREADY_STARTED = 'game-already-started';
    public static PLAYER_ASSIGNED_SUCCESSFUL = 'player-assigned-successful';
    public static RECEIVE_CONFIRMATION = 'receive-confirmation';
    public static UPDATE_CHARACTER_SELECTOR = 'update-character-selector';
    public static START_GAME = 'start-game';
    public static UPDATE_PLAYER_XY = 'update-player-xy';
    public static UPDATE_TIMER = 'update-timer';
    public static UPDATE_PLAYER_Z = 'update-player-up';
    public static UPDATE_PLAYER_SCORE = 'update_player_score';

    static connect () {
        Network.socket = io();
        Network.initialize();
    }

    private static initialize () {
        Network.socket.on('disconnect', () => {
            document.location.reload();
        });
    }

    /**
     * Usunięcie podanego listenere
     * @static
     * @param {string} listener 
     * @memberof Network
     */
    public static removeListener(listener: string) {
        Network.socket.off(listener);
    }

    /**
     * Nadaje informację o nowym graczu
     * @static
     * @param {any} id 
     * @memberof Network
     */
    public static newPlayer({ id, gameId }) {
        Network.socket.emit(Network.NEW_PLAYER, { id: id, gameId: gameId });
    }

    /**
     * Ustawia postać gracza
     * @static
     * @param {string} character 
     * @memberof Network
     */
    public static setPlayerAvatar(character: string) {
        Network.socket.emit(Network.SET_PLAYER_CHARACTER, character);
    }

    /**
     * Pobiera postacie które są już używane
     * @static
     * @memberof Network
     */
    public static getAvatarsInUse() {
        Network.socket.emit(Network.GET_CHARACTERS_IN_USE);
    }

    /**
     * Aktualizacja pozycji gracza
     * @static
     * @memberof Network
     */
    public static updatePlayerXY(gameId, update) {
        Network.socket.emit(Network.UPDATE_PLAYER_XY, gameId, update);
    }

    /**
     * Aktualizacja pozycji gracza
     * @static
     * @param {any} gameID 
     * @param {any} update 
     * @memberof Network
     */
    public static updatePlayerZ(gameID, update) {
        Network.socket.emit(Network.UPDATE_PLAYER_Z, gameID, update);
    }

    /**
     * Gra jest niedostępna 
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onGameNotAvailable(fn: Function) {
        Network.socket.on(Network.GAME_NOT_AVAILABLE, fn);
    }

    /**
     * Gra ma zajęte wszystkie sloty
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onGameFull(fn: Function) {
        Network.socket.on(Network.GAME_FULL, fn);
    }

    /**
     * Gra już się rozpoczeła
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onGameAlreadyStarted(fn: Function) {
        Network.socket.on(Network.GAME_ALREADY_STARTED, fn);
    }

    /**
     * Gracz został utworzony pomyślnie
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onPlayerAssignedSuccessful(fn: Function) {
        Network.socket.on(Network.PLAYER_ASSIGNED_SUCCESSFUL, fn);
    }

    /**
     * Otrzymanie potwierdzenia
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onReceiveConfirmation(fn: Function) {
        Network.socket.on(Network.RECEIVE_CONFIRMATION, fn);
    }

    /**
     * Aktualizacja wyboru postaci
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onUpdateAvatarSelector(fn: Function) {
        Network.socket.on(Network.UPDATE_CHARACTER_SELECTOR, fn);
    }

    /**
     * Rozpoczęcie gry
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onStartGame(fn: Function) {
        Network.socket.on(Network.START_GAME, fn);
    }

    /**
     * Aktualizacja odliczania
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onUpdateTimer(fn: Function) {
        Network.socket.on(Network.UPDATE_TIMER, fn);
    }

    /**
     * Aktualizacja wyniku gracza
     * @static
     * @param {Function} fn 
     * @memberof Network
     */
    public static onUpdateScore(fn: Function) {
        Network.socket.on(Network.UPDATE_PLAYER_SCORE, fn);
    }
}