import 'p2';
import 'pixi';
import 'phaser';
import * as QRious from 'qrious';
import { States } from './States';
import config from '../../config';
import * as generators from '../../generators';
import { Assets } from '../../assets';
import { Const } from '../../const';
import { rnd } from '../../utils';

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
            generators.stars(this.game, 0.02, 0.125, Const.Stars.getName());
            Const.Nebula.Names.push('nebula-1');
            const nebulaColor = Const.Nebula.Colors[rnd.integerInRange(0, 2)];
            for (let i = 0; i < Const.Nebula.Names.length; i++) {
                generators.nebula(this.game, 'nebula-1', 0, nebulaColor);
            }
            Const.Comet.Names.push('comet-1');
            Const.Comet.Names.push('comet-2');
            Const.Comet.Names.push('comet-3');
            generators.comet(this.game, 200, 80, 20, 'comet-1');
            generators.comet(this.game, 150, 40, 10, 'comet-2');
            generators.comet(this.game, 200, 60, 15, 'comet-3');
            for( let i = 0; i < 5; i++) {
                const name = 'element-' + i;
                const color = Const.Element.Colors[rnd.integerInRange(0, 5)];
                Const.Element.Names.push(name);
                generators.element(this.game, name, color);
            }
            generators.ship(this.game, Const.Ships.GREEN.getName(), Const.Ships.GREEN.getValue());
            generators.ship(this.game, Const.Ships.PURPLE.getName(), Const.Ships.PURPLE.getValue());
            generators.ship(this.game, Const.Ships.BLUE.getName(), Const.Ships.BLUE.getValue());
            generators.ship(this.game, Const.Ships.WATERY.getName(), Const.Ships.WATERY.getValue());
            generators.ship(this.game, Const.Ships.PINK.getName(), Const.Ships.PINK.getValue());
            generators.ship(this.game, Const.Ships.RED.getName(), Const.Ships.RED.getValue());
            generators.ship(this.game, Const.Ships.YELLOW.getName(), Const.Ships.YELLOW.getValue());
            generators.ship(this.game, Const.Ships.ORANGE.getName(), Const.Ships.ORANGE.getValue());
            generators.ship(this.game, Const.Ships.GRASS.getName(), Const.Ships.GRASS.getValue());
            generators.ship(this.game, Const.Ships.DARKPINK.getName(), Const.Ships.DARKPINK.getValue());
            resolve();
        });
    }
}