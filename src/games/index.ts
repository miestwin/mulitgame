import * as io from 'socket.io-client';
import 'p2';
import 'pixi';
import 'phaser';

document.addEventListener('DOMContentLoaded', function () {

});

function startApp(): void {
    //generate qr

    const gameConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1
    };

    const game = new SimpleGame(gameConfig);
}

class SimpleGame extends Phaser.Game {
    private socket;
    constructor (config) {
        super(config);
        this.socket = io();
        //add states
    }
}

