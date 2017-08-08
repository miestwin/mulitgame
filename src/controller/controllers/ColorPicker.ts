import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';


export default class ColorPicker extends Phaser.State {

    public preload() {
        this.game.load.spritesheet('button', '../assets/images/button-sprite-sheet.png', 193, 71);
    }

    public create() {
        const text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Chose theme color', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        text.anchor.set(0.5);   
        const button_CC6600 = <any>this.game.add.button(this.game.world.centerX - 210, this.game.world.centerY - 86, 'button', this.onClick, this, 0);
        button_CC6600.anchor.set(0.5);
        button_CC6600.color = '#CC6600';
        const button_009900 = <any>this.game.add.button(this.game.world.centerX + 210, this.game.world.centerY - 86, 'button', this.onClick, this, 0);
        button_009900.anchor.set(0.5);
        button_009900.color = '#009900';
        const button_0066ff = <any>this.game.add.button(this.game.world.centerX - 210, this.game.world.centerY + 86, 'button', this.onClick, this, 0);
        button_0066ff.anchor.set(0.5);
        button_0066ff.color = '#0066ff';
        const button_ff00ff = <any>this.game.add.button(this.game.world.centerX + 210, this.game.world.centerY + 86, 'button', this.onClick, this, 0);
        button_ff00ff.anchor.set(0.5);
        button_ff00ff.color = '#ff00ff';
    }

    public onClick(pointer) {
        console.log(pointer.color);
    }

    private goToNextState() {
       
    }
}