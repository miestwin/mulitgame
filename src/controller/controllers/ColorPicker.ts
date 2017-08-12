import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';


export default class ThemePicker extends Phaser.State {
    private text: Phaser.Text;

    public preload() {
        this.game.load.spritesheet('button', '../assets/images/button-sprite-sheet.png', 193, 71);
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Chose theme', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);  

        const button_0C374D = <any>this.game.add.button(this.game.world.centerX - 210, this.game.world.centerY - 86, 'button', this.onClick, this, 0);
        button_0C374D.anchor.set(0.5);
        button_0C374D.theme = '#0C374D';

        const button_AD2A1A = <any>this.game.add.button(this.game.world.centerX + 210, this.game.world.centerY - 86, 'button', this.onClick, this, 0);
        button_AD2A1A.anchor.set(0.5);
        button_AD2A1A.theme = '#AD2A1A';

        const button_829356 = <any>this.game.add.button(this.game.world.centerX - 210, this.game.world.centerY + 86, 'button', this.onClick, this, 0);
        button_829356.anchor.set(0.5);
        button_829356.theme = '#829356';

        const button_C2571A = <any>this.game.add.button(this.game.world.centerX + 210, this.game.world.centerY + 86, 'button', this.onClick, this, 0);
        button_C2571A.anchor.set(0.5);
        button_C2571A.theme = '#C2571A';

        this.registerEvent();
    }

    public onClick(pointer) {
        Network.setTheme(pointer.theme);
    }

    private registerEvent() {
       Network.receiveConfirmation(({ confirm, theme }) => {
            if (confirm) {
                state.theme = theme;
                //this.game.state.start('WaitForPlayers');
                this.text.setText('Theme ready ' + state.theme);
            } else {
                this.text.setText('Theme already in use.\nChoose another');
            }
        });
    }
}