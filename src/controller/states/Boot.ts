import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import {
    CustomLoader
} from '../../shared';

import Network from '../network';

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
            this.game.state.start(States.LOADING);
        });

        Network.gameAlreadyStarted(() => {
            const message = 'Game already started';
            this.game.state.start(States.MESSAGE, true, false, message);
        });

        Network.gameFull(() => {
            const message = 'Game is full';
            this.game.state.start(States.MESSAGE, true, false, message);
        });

        Network.gameNotAvailable(() => {
            const message = 'Game not available';
            this.game.state.start(States.MESSAGE, true, false, message);
        });

        // load font
        (<any>this.game.load).webfont('kenvector', 'Kenvector Future');
        // load loading sprite
        this.game.load.spritesheet('jack-idle', '../assets/spritesheets/characters/jack/idle/sprite.png', 579, 763, 8);
    }

    create() {
        // assign new game
        Network.newPlayer({ id: (<any>this.game.state).id, gameId: gameId });
    }
}