import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';
declare var gameId;

export class GameError extends Phaser.State {
    private text: Phaser.Text;
    private button: Phaser.Button;

    public init() {
        
    }

    public preload() {
        this.game.stage.disableVisibilityChange = true;
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Error with game', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);
    }
}