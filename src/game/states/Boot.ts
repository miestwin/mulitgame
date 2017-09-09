import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import {
    CustomLoader
} from '../../shared';

import Network from '../network';

export class Boot extends Phaser.State {

    init() {
        // set the scale mode
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        // set custom loader
        this.game.load = new CustomLoader(this.game);
    }

    preload() {
        // initialize response from server
        Network.gameAssignedSuccessful(() => {
            this.game.state.start(States.LOADING);
        });

        // load font
        (<any>this.game.load).webfont('kenvector', 'Kenvector Future');
        // load loading sprite
        this.game.load.spritesheet('templerun', '../assets/spritesheets/characters/temple/run/sprite.png', 415, 507, 9);
    }

    create() {
        // assign new game
        console.log((<any>this.game.state).id);
        Network.newGame((<any>this.game.state).id);
    }
}