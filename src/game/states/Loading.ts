import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';
import { generatePoints, convexhull, randomNumberInRange } from '../../utils';
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

        for (let i = 0; i < 10; i++) {
            this.createShard(i);
        }

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

    /**
     * Tworzenie tekstur dla obiektów do zbierania
     * @private
     * @param {number} i 
     * @memberof Loading
     */
    private createShard(i: number) {
        const colors = [0xffffff, 0xccccff, 0xccffff, 0xb3ffb3, 0xffff99, 0xffb3ff, 0x99ccff];
        const points = convexhull(generatePoints(20, 20, 10));
        points.push(points[0]);
        const color = colors[randomNumberInRange(0, 6)];
        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(color);
        graphics.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            graphics.lineTo(point[0], point[1]);
        }
        graphics.endFill();
        this.game.cache.addImage('shard-' + i, null, graphics.generateTexture().baseTexture.source);
        graphics.destroy();
    }
}