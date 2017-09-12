import * as io from 'socket.io-client';

export default class Network {
    private static socket;

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

    public static playerDisconnected(fn: Function) {
        Network.socket.on('player-disconnected', fn);
    }

    public static gameAssignedSuccessful(fn: Function) {
        Network.socket.on('game-assigned-successful', fn);
    }

    public static newGame (id) {
        Network.socket.emit('new-game', { id: id });
    }

    public static updatePlayersState(fn: Function) {
        Network.socket.on('update-players-state', fn);
    }
}