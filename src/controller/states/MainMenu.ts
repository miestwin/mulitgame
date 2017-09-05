import 'p2';
import 'pixi';
import 'phaser';

import state from '../state';
import Network from '../network';

declare var gameId;

export class MainMenu extends Phaser.State {

    public preload() {
        
    }

    public create() {
        var helloText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 40, 'Hello player\nlets start', { font: '35px Kenvector Future', fill: '#ffffff', align: 'center'});
        helloText.anchor.set(0.5, 0);
        var button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 5, 'grey-button-04', this.actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0);
        var buttonText = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 7, 'CONTINUE', { font: '10px Kenvector Future', fill: '#000000', align: 'center'});
        helloText.anchor.set(0.5, 0);
    }

    private actionOnClick() {
        // go to next state
        console.log('next state');
    }
}