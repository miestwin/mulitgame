import 'p2';
import 'pixi';
import 'phaser';
import state from '../state';
import Network from '../network';


export default class Main extends Phaser.State {
    //private colorPicker: Phaser.Sprite;
    private text: Phaser.Text;
    private button: Phaser.Button;

    public preload() {
        //this.game.stage.backgroundColor = '#FFFFFF';
        // this.bmd = this.game.add.bitmapData(200, 200);
        // this.game.add.sprite(2, 2, this.bmd);
        // this.colors = Phaser.Color.HSVColorWheel();
        // this.bmd.circle(102, 102, 100, this.colors[0].rgba);
        // console.log(this.colors);
        //this.game.load.image('color-wheel', '../assets/images/color-wheel.png');
        this.game.load.image('start', '../assets/images/start-game.png');
    }

    public create() {
        //this.colorPicker = this.game.add.sprite((window.innerWidth / 2), (window.innerHeight / 2), 'color-wheel');
        //this.colorPicker.anchor.set(0.5, 0.5);
        //this.colorPicker.scale.set(100, 100);
        this.text = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 300, 'Hello player\nlets start', { font: '65px Arial', fill: '#ffffff', align: 'center'});
        this.text.anchor.set(0.5);
        this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY + 200, 'start', this.goToNextState);
        this.button.anchor.set(0.5);
    }

    private goToNextState() {
        this.game.state.start('ColorPicker');
    }
}