import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import { Assets } from '../../assets';

/**
 * Informacje wstępne
 * @export
 * @class MainMenu
 * @extends {Phaser.State}
 */
export class MainMenu extends Phaser.State {

    public preload() {}

    public create() {
        var helloText = this.game.add.text(
            this.game.world.centerX, 
            this.game.world.centerY - 90, 
            'Back story\nand game rules', 
            { font: `35px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#ffffff', align: 'center' });
        helloText.anchor.set(0.5, 0);
        var button = this.game.add.button(
            this.game.world.centerX, 
            this.game.world.centerY + 10, 
            Assets.UI.Buttons.Menu.Grey.getName(), 
            this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0);
        var buttonText = this.game.add.text(
            this.game.world.centerX, 
            this.game.world.centerY + 20, 
            'Continue', 
            { font: `20px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#000000', align: 'center' });
        buttonText.anchor.set(0.5, 0);
    }

    private actionOnClick() {
        this.game.state.start(States.AVATAR_SELECTOR);
    }
}