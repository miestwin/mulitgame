import 'p2';
import 'pixi';
import 'phaser';
import 'canvasinput';
// import 'phaser-input';

import state from '../state';

import Network from '../network';

declare var CanvasInput;

export default class Main extends Phaser.State {
    private nicknameInput;

    public preload() {
        this.nicknameInput = new CanvasInput.CanvasInput({
            canvas: document.getElementById('controller'),
            fontSize: 18,
            width: 300,
            borderWidth: 1,
            borderColor: '#ffffff',
            placeHolder: 'Enter nickname'
        });
    }

    public create() {

    }
}