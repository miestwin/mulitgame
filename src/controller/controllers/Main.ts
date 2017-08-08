import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';
declare var gameId;

export default class Main extends Phaser.State {
    //private colorPicker: Phaser.Sprite;
    private text: Phaser.Text;
    private button: Phaser.Button;

    public preload() {
        this.game.load.image('start', '../assets/images/start-game.png');
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Hello player\nlets start', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);
        this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'start', this.goToNextState);
        this.button.anchor.set(0.5);
    }

    private goToNextState() {
        Network.newPlayer({ id: state.id, gameId: gameId });
        this.game.state.start('ColorPicker');
    }
}