import 'p2';
import 'pixi';
import 'phaser';

import {
    States,
    Boot,
    Loading,
    MainMenu,
    CharacterSelector,
    Message
} from './states';

import Network from './network';
import { guid } from '../utils/guid';

export default class Controller extends Phaser.Game {
    constructor (config) {
        super(config);
        // create controller id
        (<any>this.state).id = guid();

        // connect to server
        Network.connect();

        // add states to controller
        this.state.add(States.BOOT, Boot);
        this.state.add(States.LOADING, Loading);
        this.state.add(States.MAINMENU, MainMenu);
        this.state.add(States.CHARACTERSELECTOR, CharacterSelector);
        this.state.add(States.MESSAGE, Message);

        this.state.start(States.BOOT);
    }
}