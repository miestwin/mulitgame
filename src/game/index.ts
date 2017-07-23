import 'p2';
import 'pixi';
import 'phaser';

import state from './state';

import Main from './games/Main';

import Network from './network';

document.addEventListener('DOMContentLoaded', function () {
    startApp();
});

function startApp(): void {
    const gameConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: document.getElementById('game'),
        resolution: 1
    };
    console.log(state.id);
    const game = new App(gameConfig);
}

class App extends Phaser.Game {
    private socket;
    private qr;
    constructor (config) {
        Network.connect();
        Network.newGame(state.id);
        super(config);
        this.state.add('Main', Main);
        this.state.start('Main');
    }
}


