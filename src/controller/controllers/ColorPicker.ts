import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';


export default class ColorPicker extends Phaser.State {
    private text: Phaser.Text;

    public preload() {
        
    }

    public create() {
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'color pickert', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);    
    }

    private goToNextState() {
       
    }
}