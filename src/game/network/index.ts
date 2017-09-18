import * as io from 'socket.io-client';

export default class Network {
    private static socket;

    // emit
    public static NEW_GAME = 'new-game';

    // on
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

    public static removeListener(listener: string) {
        Network.socket.off(listener);
    }

    public static newGame (id) {
        Network.socket.emit(Network.NEW_GAME, { id: id });
    }

    public static playerDisconnected(fn: Function) {
        Network.socket.on(Network.PLAYER_DISCONNECTED, fn);
    }

    public static gameAssignedSuccessful(fn: Function) {
        Network.socket.on(Network.GAME_ASSIGNED_SUCCESSFUL, fn);
    }

    public static updatePlayersState(fn: Function) {
        Network.socket.on(Network.UPDATE_PLAYERS_STATE, fn);
    }
}