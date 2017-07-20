import * as io from 'socket.io-client';
import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';

document.addEventListener('DOMContentLoaded', function () {
    startApp();
});

function startApp(): void {
    // generate qr

    const gameConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: document.getElementById('game'),
        resolution: 1
    };

    const game = new SimpleGame(gameConfig);

    // let qr = new QRious.QRious({
    //     element: document.getElementById('game'),
    //     value: 'https://github.com/miestwin'
    // });
}

class SimpleGame extends Phaser.Game {
    private socket;
    constructor (config) {
        super(config);
        this.socket = io();
        // add states
    }
}

