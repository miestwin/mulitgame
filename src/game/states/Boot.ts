import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import {
    CustomLoader
} from '../../shared';

import Network from '../network';

/**
 * Uruchamianie systemu
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
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
        this.game.load.spritesheet('jack-run', '../assets/spritesheets/characters/jack/run/sprite.png', 579, 763, 8);
    }

    create() {
        // assign new game
        console.log((<any>this.game.state).id);
        Network.newGame((<any>this.game.state).id);
    }

    shutdown() {
        Network.removeListener(Network.GAME_ASSIGNED_SUCCESSFUL);
    }
}