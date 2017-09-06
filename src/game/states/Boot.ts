import 'p2';
import 'pixi';
import 'phaser';

import {
    CustomLoader
} from '../../share';

import Network from '../network';
import state from '../state';

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
            this.game.state.start('Loading');
        });

        // load font
        (<any>this.game.load).webfont('kenvector', 'Kenvector Future');
        // load loading sprite
        this.game.load.spritesheet('templerun', '../assets/spritesheets/characters/temple/run/sprite.png', 415, 507, 9);
    }

    create() {
        // assign new game
        console.log(state.id);
        Network.newGame(state.id);
    }
}