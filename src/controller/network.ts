import * as io from 'socket.io-client';

export default class Network {
    private static socket;

    static connect () {
        Network.socket = io();
        Network.initialize();
    }

    private static initialize () {
        Network.socket.on('player-joined', () => {

        });

        Network.socket.on('game-start', () => {
            
        });

        Network.socket.on('game-end', () => {
            
        });

        Network.socket.on('disconnect', () => {
            document.location.reload();
        });

        Network.socket.on('game-disconnected', () => {
            console.log('game-disconnected');
        });

        Network.socket.on('game-invalid', () => {
            
        });

        Network.socket.on('game-has-started', () => {
            
        });

        Network.socket.on('game-full', () => {
            
        });

        Network.socket.on('game-not-available', () => {
            console.log('game-not-available');
        });

        Network.socket.on('player-assigned-successful', () => {
            console.log('Player assigned');
        });
    }

    public static newPlayer({ id, gameId }) {
        Network.socket.emit('new-player', { id: id, gameId: gameId });
    }
}