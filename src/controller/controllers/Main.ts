import 'p2';
import 'pixi';
import 'phaser';
// import 'phaser-input';
// import 'canvasinput';

import state from '../state';

import Network from '../network';
declare var CanvasInput;

export default class Main extends Phaser.State {
    private nicknameInput;

    public preload() {
        // let plugin = new PhaserInput.Plugin(this.game, this.game.plugins);
        // this.game.add.plugin(plugin);
        // this.game.plugins.add(PhaserInput.Plugin);
        // this.nicknameInput = this.game.add.inputField(10, 90);
        this.nicknameInput = new CanvasInput({
            canvas: document.getElementById('controller'),
            backgroundColor: '#000',
            fontColor: '#fff'
        });
    }

    public create() {

    }
}