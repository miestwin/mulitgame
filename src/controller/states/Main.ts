import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';
declare var gameId;

export class Main extends Phaser.State {
    private text: Phaser.Text;
    private button: Phaser.Button;

    public preload() {
        this.game.stage.disableVisibilityChange = true;
        this.game.load.image('start', '../assets/images/start-game.png');
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Hello player\nlets start', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);
        this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'start', this.goToNextState);
        this.button.anchor.set(0.5);

        Network.playerAssignedSuccessful(() => {
            this.game.state.start('ThemePicker');
        });

        Network.gameNotAvailable(() => {
            this.game.state.start('Error');
        });

        Network.gameAlreadyStarted(() => {
            this.game.state.start('Error');
        });

        Network.gameFull(() => {
            this.game.state.start('Error');
        });
    }

    private goToNextState() {
        Network.newPlayer({ id: state.id, gameId: gameId });
    }
}