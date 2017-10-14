import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

/**
 * Informacje wstępne
 * @export
 * @class MainMenu
 * @extends {Phaser.State}
 */
export class MainMenu extends Phaser.State {

    public preload() {}

    public create() {
        var helloText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 90, 'Hello player\nlets start', { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        helloText.anchor.set(0.5, 0);
        var button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 10, 'grey-button-04', this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0);
        var buttonText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 20, 'Continue', { font: '20px Kenvector Future', fill: '#000000', align: 'center' });
        buttonText.anchor.set(0.5, 0);
    }

    private actionOnClick() {
        this.game.state.start(States.AVATAR_SELECTOR);
    }
}