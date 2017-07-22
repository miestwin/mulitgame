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

        Network.socket.on('game-assigned-successful', () => {

        });

        Network.socket.on('update-game', () => {

        });

        Network.socket.on('player-joined', () => {

        });

        Network.socket.on('game-end', () => {

        });

        Network.socket.on('player-disconnected', () => {

        });

        Network.socket.on('disconnect', () => {
            document.location.reload();
        });
    }

    public newGame (id) {
        Network.socket.emit('new-game', { id: id });
    }
}