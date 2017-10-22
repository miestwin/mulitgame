import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';

import { States } from './States';
import config from '../../config';

/**
 * Ładowanie zasobów
 * @export
 * @class Loading
 * @extends {Phaser.State}
 */
export class Loading extends Phaser.State {

    private loadingSprite: Phaser.Sprite;
    private loadingText: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = '#000000';

        this.game.load.onLoadStart.add(this.loadStart, this);
        this.game.load.onFileComplete.add(this.fileComplete, this);
        this.game.load.onLoadComplete.add(this.loadComplete, this);

        // this.game.load.image('player-ship_blue', '../assets/spritesheets/player/player-ship_blue.png');
        // this.game.load.image('player-ship_green', '../assets/spritesheets/player/player-ship_green.png');
        // this.game.load.image('player-ship_red', '../assets/spritesheets/player/player-ship_red.png');
        // this.game.load.image('player-ship_yellow', '../assets/spritesheets/player/player-ship_yellow.png');

        this.game.load.image('grey-button-04', '../assets/spritesheets/gui/ui/PNG/grey_button04.png');
        this.game.load.image('background', '../assets/images/purple.png');
        this.game.load.image('shard', '../assets/images/shard.png');
        // this.game.load.shader('bacteria', '../assets/shaders/bacteria.frag');
        this.game.load.shader('glow', '../assets/shaders/glow.frag');
    }

    create() {
        // create qrcode and go to next state
        this.loadingText.setText('Create QRCode ...');
        this.createQRCode().then(() => {
            this.loadingText.setText('Create QRCode Complete');
            this.game.state.start(States.MAIN_MENU);
        });
    }

    /**
     * Funkcja stanu ładowania
     * Tworzy ekran ładowania
     * Wywoływana jest na początku
     * @private
     * @memberof Loading
     */
    private loadStart() {
        this.loadingSprite = this.game.add.sprite(
            this.game.world.centerX,
            this.game.world.centerY - 40,
            'explosion-3');
        this.loadingSprite.anchor.set(0.5);
        this.loadingSprite.scale.set(1.1);
        this.loadingSprite.animations.add('boom');
        this.loadingSprite.animations.play('boom', 20, true);

        this.loadingText = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 50,
            'Loading ...',
            { 
                font: '25px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        this.loadingText.anchor.set(0.5);
    }

    /**
     * Funkcja stanu ładowania
     * Aktualizuje informację o postępach ładowania
     * @private
     * @param {any} progress 
     * @param {any} cacheKey 
     * @param {any} success 
     * @param {any} totalLoaded 
     * @param {any} totalFiles 
     * @memberof Loading
     */
    private fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
        this.loadingText.setText(`Loading ${progress}%`);
    }

    /**
     * Funkcja stanu ładowania
     * Informuje o zakończeniu ładowania zasobów
     * @private
     * @memberof Loading
     */
    private loadComplete() {
        this.loadingText.setText('Load Complete');
    }

    /**
     * Tworzenie kodu QR
     * @private
     * @returns {Promise<any>} 
     * @memberof Loading
     */
    private createQRCode(): Promise<any>  {
        let that = this;
        return new Promise((resolve, reject) => {
            let qr = new QRious({
                value: config.url + '/controller/' + (<any>this.game.state).id,
                background: '#ffffff',
                padding: 20,
                size: 300
            });
            qr = qr.toDataURL('image/jpeg');
            let img = new Image();
            img.onload = () => { 
                that.game.cache.addImage('qrcode', img.src, img); 
                resolve();
            };
            img.title = (<any>this.game.state).id;
            img.src = qr;
        });
    }
}