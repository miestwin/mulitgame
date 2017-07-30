import 'p2';
import 'pixi';
import 'phaser';

import state from '../state';

import Network from '../network';
declare var CanvasInput;

export default class Main extends Phaser.State {
    private nicknameInput;
    private bmd;
    private colors;

    public preload() {
        this.game.stage.backgroundColor = '#FFFFFF';

        const canvasInput = document.getElementById('canvas-input-area');
        canvasInput.style.display = 'block';
        this.nicknameInput = new CanvasInput({
            canvas: canvasInput,
            backgroundColor: '#000',
            fontColor: '#fff',
            width: 300,
            height: 40
        });

        this.bmd = this.game.add.bitmapData(200, 200);
        this.game.add.sprite(window.innerWidth / 2, window.innerHeight / 2, this.bmd);
        this.colors = Phaser.Color.HSVColorWheel();
        this.bmd.circle(window.innerWidth / 2, window.innerHeight / 2, 200, this.colors[0].rgba);
    }

    public create() {

    }
}