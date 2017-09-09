import 'p2';
import 'pixi';
import 'phaser';

import {
    States,
    Boot,
    Loading,
    MainMenu
} from './states';

import Network from './network';
import { guid } from '../utils/guid';

export default class Game extends Phaser.Game {

    constructor (config) {
        super(config);
        // create game id
        (<any>this.state).id = guid();
        
        // connect to server
        Network.connect();

        // add sstates to game
        this.state.add(States.BOOT, Boot);
        this.state.add(States.LOADING, Loading);
        this.state.add(States.MAINMENU, MainMenu);

        this.state.start(States.BOOT);
    }
}