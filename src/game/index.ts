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
        super(config);
        this.state.add('Main', Main);
        Network.connect();
        Network.gameAssignedSuccessful(() => {
            this.state.start('Main');
        });
        Network.newGame(state.id);
    }
}


