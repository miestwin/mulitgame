import 'p2';
import 'pixi';
import 'phaser';

import {
    CustomLoader
} from '../../share';

import Network from '../network';
import state from '../state';

declare var gameId;

export class Boot extends Phaser.State {

    init() {
        // set the scale mode
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        // set custom loader
        this.game.load = new CustomLoader(this.game);
    }

    preload() {
        // initialize response from server
        Network.playerAssignedSuccessful(() => {
            this.game.state.start('Loading');
        });

        // load font
        (<any>this.game.load).webfont('kenvector', 'Kenvector Future');
        // load loading sprite
        this.game.load.spritesheet('jack-idle', '../assets/spritesheets/characters/jack/idle/sprite.png', 579, 763, 8);
    }

    create() {
        // assign new game
        Network.newPlayer({ id: state.id, gameId: gameId });
    }
}