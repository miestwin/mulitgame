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

    /**
     * Tekst na przycisku
     * @private
     * @type {string}
     * @memberof Message
     */
    private text: string;

    /**
     * Akcja przycisku
     * @private
     * @type {Function}
     * @memberof Message
     */
    private action: Function;

    init(message: string, text: string, action: Function) {
        this.message = message;
        this.text = text;
        this.action = action.bind(this);
    }

    preload() {}

    create() {
        var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 30, this.message, { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        message.anchor.set(0.5);
        var button = this.game.add.button(this.game.world.centerX, this.game.height + 30, 'grey-button-04', this.action, this, 2, 1, 0);
        button.anchor.set(0.5);
        var buttonText = this.game.add.text(this.game.world.centerX, this.game.height + 30, this.text, { font: '20px Kenvector Future', fill: '#000000', align: 'center' });
        buttonText.anchor.set(0.5);
    }
}