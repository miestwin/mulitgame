import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';
import { States } from './States';
import config from '../../config';
import { Color } from '../../models'
import { generatePowerUps, generateShips, pointStars, generateComet, generateNebula } from '../../engine';
import { randomNumberInRange } from '../../utils';
import { Assets } from '../../assets';

const colors = [ new Color(179, 0, 179), new Color(225, 51, 0), new Color(0, 153, 51) ];

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

        /* spritesheets */
        this.game.load.spritesheet(
            Assets.Spritesheets.Plasma.getName(), 
            Assets.Spritesheets.Plasma.getPNG(),
            Assets.Spritesheets.Plasma.getFrameWidth(),
            Assets.Spritesheets.Plasma.getFrameHeight(),
            Assets.Spritesheets.Plasma.getFrameMax());

        this.game.load.spritesheet(
            Assets.Spritesheets.Bullets.RGBLaser.getName(),
            Assets.Spritesheets.Bullets.RGBLaser.getPNG(),
            Assets.Spritesheets.Bullets.RGBLaser.getFrameWidth(),
            Assets.Spritesheets.Bullets.RGBLaser.getFrameHeight());
        
        /* game images */
        this.game.load.image(
            Assets.Images.Shield.getName(),
            Assets.Images.Shield.getPNG());

        /* ui */
        this.game.load.image(
            Assets.UI.Buttons.Menu.Grey.getName(),
            Assets.UI.Buttons.Menu.Grey.getPNG());
        
        /* shaders */
        this.game.load.shader(
            Assets.Shaders.Glow.getName(),
            Assets.Shaders.Glow.getFRAG()
        );

        this.game.load.shader(
            Assets.Shaders.Pixelate.getName(),
            Assets.Shaders.Pixelate.getFRAG()
        );
    }

    create() {
        // create qrcode and go to next state
        this.loadingText.setText('Create Textures ...');
        Promise.all([this.createQRCode(), this.createTextures()]).then(() => {
            this.loadingText.setText('Create QRCode Complete');
            this.game.state.start(States.MAIN_MENU);
        });
        // .catch(() => {
        //     this.game.state.start(States.MESSAGE, true, false, 'Problem with generating texture');
        // });
        // this.createQRCode().then(() => {
        //     this.loadingText.setText('Create QRCode Complete');
        //     this.game.state.start(States.MAIN_MENU);
        // });
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
            Assets.Spritesheets.Explosions.Three.getName());
        this.loadingSprite.anchor.set(0.5);
        this.loadingSprite.scale.set(1.1);
        this.loadingSprite.animations.add('boom');
        this.loadingSprite.animations.play('boom', 20, true);

        this.loadingText = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 50,
            'Loading ...',
            { 
                font: `25px ${Assets.Fonts.Kenvector.getFamily()}`,
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

    private createTextures(): Promise<any> {
        return new Promise((resolve, reject) => {
            pointStars(this.game, 0.02, 0.125);
            const color = colors[randomNumberInRange(0, 2)];
            generateNebula(this.game, 'nebula-1', 0, color);
            // generateNebula(this.game, 'nebula-2', 1000, color);
            generateComet(this.game, 200, 80, 20, 'comet-1');
            generateComet(this.game, 150, 40, 10, 'comet-2');
            generateComet(this.game, 200, 60, 15, 'comet-3');
            generatePowerUps(this.game);
            generateShips(this.game);
            resolve();
        });
    }
}