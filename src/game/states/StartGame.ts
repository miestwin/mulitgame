import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

/**
 * Start rozgrywki
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class StartGame extends Phaser.State {

    preload() {}

    create() {
        var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'GAME START NOW', { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        message.anchor.set(0.5);
    }

    shutdown() {}
}