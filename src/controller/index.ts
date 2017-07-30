import 'p2';
import 'pixi';
import 'phaser';

import state from './state';

import Main from './controllers/Main';

import Network from './network';

document.addEventListener('DOMContentLoaded', function () {
    startApp();
});

function startApp(): void {
    const controllerConfig = {
        width: window.innerWidth,
        height: window.innerHeight,
        renderer: Phaser.AUTO,
        parent: document.getElementById('controller'),
        resolution: 1
    };
    console.log(state.id);
    const controller = new App(controllerConfig);
}

class App extends Phaser.Game {
    private socket;
    private qr;
    constructor (config) {
        super(config);
        Network.connect();
        //Network.newController(state.id);
        this.state.add('Main', Main);
        this.state.start('Main');
    }
}


