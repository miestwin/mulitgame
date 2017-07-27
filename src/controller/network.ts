import * as io from 'socket.io-client';

export default class Network {
    private static socket;

    static connect () {
        Network.socket = io();
    }

    private static initialize () {
        Network.socket.on('player-joined', () => {

        });

        Network.socket.on('game-start', function () {
            
        });

        Network.socket.on('game-end', function () {
            
        });

        Network.socket.on('disconnect', function () {
            document.location.reload();
        });

        Network.socket.on('game-not-available', function () {
            
        });

        Network.socket.on('game-invalid', () => {
            
        });

        Network.socket.on('game-has-started', function () {
            
        });

        Network.socket.on('game-full', function () {
            
        });
    }

    public static newController(id) {
        Network.socket.emit('new-player', { id: id });
    }
}