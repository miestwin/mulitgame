import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import { generateShips } from '../../engine';
import { Assets } from '../../assets';

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

        /* ui */
        this.game.load.image(
            Assets.UI.Buttons.Joystick.WheelExternal.getName(),
            Assets.UI.Buttons.Joystick.WheelExternal.getPNG()
        );

        this.game.load.image(
            Assets.UI.Buttons.Joystick.WheelInternal.getName(), 
            Assets.UI.Buttons.Joystick.WheelInternal.getPNG());

        this.game.load.image(
            Assets.UI.Buttons.Shield.getName(), 
            Assets.UI.Buttons.Shield.getPNG());

        this.game.load.image(
            Assets.UI.Buttons.Fire.getName(), 
            Assets.UI.Buttons.Fire.getPNG());

        this.game.load.image(
            Assets.UI.Buttons.Menu.Grey.getName(), 
            Assets.UI.Buttons.Menu.Grey.getPNG());
        
        this.game.load.image(
            Assets.Images.Transparent.getName(), 
            Assets.Images.Transparent.getPNG());

        generateShips(this.game);
    }

    create() {
        this.game.state.start(States.MAIN_MENU);
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
        this.loadingSprite.animations.add('boom');
        this.loadingSprite.animations.play('boom', 20, true);

        this.loadingText = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 25,
            'Loading ...',
            { 
                font: `20px ${Assets.Fonts.Kenvector.getFamily()}`,
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
}