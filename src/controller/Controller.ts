import 'p2';
import 'pixi';
import 'phaser';

import {
    Boot,
    Loading,
    MainMenu
} from './states';

import Network from './network';

export default class Controller extends Phaser.Game {
    constructor (config) {
        super(config);
        // connect to server
        Network.connect();

        // add states to controller
        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('MainMenu', MainMenu);

        this.state.start('Boot');
    }
}