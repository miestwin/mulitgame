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
}

class SimpleGame extends Phaser.Game {
    private socket;
    private qr;
    constructor (config) {
        super(config);
        this.socket = io();
        this.state.add('FirstState', FirstState);
        this.state.start('FirstState');
    }
}

class FirstState extends Phaser.State {
    private qr;

    public preload() {
        let that = this;
        this.qr = new QRious({
            value: 'https://github.com/miestwin'
        });
        this. qr = this.qr.toDataURL('image/jpeg');
        let data = new Image();
        data.src = this.qr;
        that.game.cache.addImage('image-data', data.src, data);
    }

    public create() {
         this.game.add.sprite(0, 0, 'image-data');
    }
}

