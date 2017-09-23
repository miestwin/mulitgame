import * as io from 'socket.io-client';

/**
 * Połączenie z serwerem
 * @export
 * @class Network
 */
export default class Network {
    private static socket;

    /**
     * Nazwy emiterów
     * @static
     * @memberof Network
     */
    public static NEW_GAME = 'new-game';

    /**
     * Nazwy listenerów
     * @static
     * @memberof Network
     */
    public static PLAYER_DISCONNECTED = 'player-disconnected';
    public static GAME_ASSIGNED_SUCCESSFUL = 'game-assigned-successful';
    public static UPDATE_PLAYERS_STATE = 'update-players-state';

    public static connect () {
        Network.socket = io();
        Network.initialize();
    }

    private static initialize () {
        Network.socket.on('game-start', () => {

        });

        Network.socket.on('update-game', () => {

        });

        Network.socket.on('game-end', () => {

        });

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
     * Nadaje informację o nowej grze
     * @static
     * @param {any} id 
     * @memberof Network
     */
    public static newGame (id) {
        Network.socket.emit(Network.NEW_GAME, { id: id });
    }

    /**
     * Nasłuchiwanie czy gracz się rozłączył
     * @static
     * @param {Function} fn Funkcja która zostanie wykonana
     * @memberof Network
     */
    public static playerDisconnected(fn: Function) {
        Network.socket.on(Network.PLAYER_DISCONNECTED, fn);
    }

    /**
     * Nasłuchiwanie czy gra została utworzona pomyślnie
     * @static
     * @param {Function} fn Funkcja która zostanie wykonana
     * @memberof Network
     */
    public static gameAssignedSuccessful(fn: Function) {
        Network.socket.on(Network.GAME_ASSIGNED_SUCCESSFUL, fn);
    }

    /**
     * Nasłuchiwanie zaktualizowania stanu graczy
     * @static
     * @param {Function} fn Funkcja która zostanie wykonana
     * @memberof Network
     */
    public static updatePlayersState(fn: Function) {
        Network.socket.on(Network.UPDATE_PLAYERS_STATE, fn);
    }
}