import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';

export class WaitForGame extends Phaser.State {
    private text: Phaser.Text;

    public preload() {
        this.stage.backgroundColor = state.theme;
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Wait for game', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);
    }
}