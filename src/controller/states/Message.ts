import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';
import { Assets } from '../../assets';

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

    init(message: string, text?: string, action?: Function) {
        this.message = message;
        this.text = text ? text : null;
        this.action = action ? action.bind(this) : null;
    }

    preload() {}

    create() {
        var message = this.game.add.text(
            this.game.world.centerX, 
            this.game.world.centerY, 
            this.message, 
            { font: `35px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#ffffff', align: 'center' });
        message.anchor.set(0.5);
        if (this.text && this.action) {
            var button = this.game.add.button(
                this.game.world.centerX,
                this.game.height + 30,
                Assets.UI.Buttons.Menu.Grey.getName(),
                this.action, this, 2, 1, 0);
            button.anchor.set(0.5);
            var buttonText = this.game.add.text(
                this.game.world.centerX,
                this.game.height + 30,
                this.text,
                { font: `20px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#000000', align: 'center' });
            buttonText.anchor.set(0.5);
        }
    }
}