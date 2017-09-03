import 'p2';
import 'pixi';
import 'phaser';

import {
    Boot,
    Loading,
    MainMenu
} from './states';

import Network from './network';
import state from './state';

export default class Game extends Phaser.Game {
    constructor (config) {
        super(config);
        // connect to server
        Network.connect();

        // add sstates to game
        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('MainMenu', MainMenu);

        this.state.start('Boot');
    }
}