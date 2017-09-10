import * as io from 'socket.io-client';

export default class Network {
    private static socket;

    static connect () {
        Network.socket = io();
        Network.initialize();
    }

    private static initialize () {

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
    }

    public static newPlayer({ id, gameId }) {
        Network.socket.emit('new-player', { id: id, gameId: gameId });
    }

    public static setPlayerCharacter(character: string) {
        Network.socket.emit('set-player-character', character);
    }

    public static gameNotAvailable(fn: Function) {
        Network.socket.on('game-not-available', fn);
    }

    public static gameFull(fn: Function) {
        Network.socket.on('game-full', fn);
    }

    public static gameAlreadyStarted(fn: Function) {
        Network.socket.on('game-already-started', fn);
    }

    public static playerAssignedSuccessful(fn: Function) {
        Network.socket.on('player-assigned-successful', fn);
    }


    public static receiveConfirmation(fn: Function) {
        Network.socket.on('receive-confirmation', fn);
    }

    public static updateCharacterSelector(fn: Function) {
        Network.socket.on('update-character-selector', fn);
    }
}