import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';

/**
 * Wyświetlanie wiadomości z błędami
 * @export
 * @class Message
 * @extends {Phaser.State}
 */
export class Message extends Phaser.State {

    /**
     * Wiadomość dla gracza
     * @private
     * @type {string}
     * @memberof Message
     */
    private message: string;

    init(message: string) {
        this.message = message;
    }

    preload() {}

    create() {
        var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.message, { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        message.anchor.set(0.5);
    }
}