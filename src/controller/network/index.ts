import * as io from 'socket.io-client';

export default class Network {
    private static socket;

    // emit
    public static NEW_PLAYER = 'new-player';
    public static SET_PLAYER_CHARACTER = 'set-player-character';
    public static GET_CHARACTERS_IN_USE = 'get-characters-in-use';

    // on
    public static GAME_NOT_AVAILABLE = 'game-not-available';
    public static GAME_FULL = 'game-full';
    public static GAME_ALREADY_STARTED = 'game-already-started';
    public static PLAYER_ASSIGNED_SUCCESSFUL = 'player-assigned-successful';
    public static RECEIVE_CONFIRMATION = 'receive-confirmation';
    public static UPDATE_CHARACTER_SELECTOR = 'update-character-selector';

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

    public static removeListener(listener: string) {
        Network.socket.off(listener);
    }

    public static newPlayer({ id, gameId }) {
        Network.socket.emit(Network.NEW_PLAYER, { id: id, gameId: gameId });
    }

    public static setPlayerCharacter(character: string) {
        Network.socket.emit(Network.SET_PLAYER_CHARACTER, character);
    }

    public static getCharactersInUse() {
        Network.socket.emit(Network.GET_CHARACTERS_IN_USE);
    }

    public static gameNotAvailable(fn: Function) {
        Network.socket.on(Network.GAME_NOT_AVAILABLE, fn);
    }

    public static gameFull(fn: Function) {
        Network.socket.on(Network.GAME_FULL, fn);
    }

    public static gameAlreadyStarted(fn: Function) {
        Network.socket.on(Network.GAME_ALREADY_STARTED, fn);
    }

    public static playerAssignedSuccessful(fn: Function) {
        Network.socket.on(Network.PLAYER_ASSIGNED_SUCCESSFUL, fn);
    }


    public static receiveConfirmation(fn: Function) {
        Network.socket.on(Network.RECEIVE_CONFIRMATION, fn);
    }

    public static updateCharacterSelector(fn: Function) {
        Network.socket.on(Network.UPDATE_CHARACTER_SELECTOR, fn);
    }
}