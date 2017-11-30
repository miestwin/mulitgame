import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import * as generators from '../../generators';
import { Assets } from '../../assets';
import { Const } from '../../const';

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

        /* ships */
        this.game.load.image(
            Assets.Images.Ships.GREEN.getName(),
            Assets.Images.Ships.GREEN.getPNG());

        this.game.load.image(
            Assets.Images.Ships.PURPLE.getName(),
            Assets.Images.Ships.PURPLE.getPNG());

        this.game.load.image(
            Assets.Images.Ships.BLUE.getName(),
            Assets.Images.Ships.BLUE.getPNG());

        this.game.load.image(
            Assets.Images.Ships.WATERY.getName(),
            Assets.Images.Ships.WATERY.getPNG());

        this.game.load.image(
            Assets.Images.Ships.PINK.getName(),
            Assets.Images.Ships.PINK.getPNG());

        this.game.load.image(
            Assets.Images.Ships.RED.getName(),
            Assets.Images.Ships.RED.getPNG());

        this.game.load.image(
            Assets.Images.Ships.YELLOW.getName(),
            Assets.Images.Ships.YELLOW.getPNG());

        this.game.load.image(
            Assets.Images.Ships.ORANGE.getName(),
            Assets.Images.Ships.ORANGE.getPNG());

        this.game.load.image(
            Assets.Images.Ships.GRASS.getName(),
            Assets.Images.Ships.GRASS.getPNG());

        this.game.load.image(
            Assets.Images.Ships.DARKPINK.getName(),
            Assets.Images.Ships.DARKPINK.getPNG());
            
        // generators.ship(this.game, Const.Ships.GREEN.getName(), Const.Ships.GREEN.getValue());
        // generators.ship(this.game, Const.Ships.PURPLE.getName(), Const.Ships.PURPLE.getValue());
        // generators.ship(this.game, Const.Ships.BLUE.getName(), Const.Ships.BLUE.getValue());
        // generators.ship(this.game, Const.Ships.WATERY.getName(), Const.Ships.WATERY.getValue());
        // generators.ship(this.game, Const.Ships.PINK.getName(), Const.Ships.PINK.getValue());
        // generators.ship(this.game, Const.Ships.RED.getName(), Const.Ships.RED.getValue());
        // generators.ship(this.game, Const.Ships.YELLOW.getName(), Const.Ships.YELLOW.getValue());
        // generators.ship(this.game, Const.Ships.ORANGE.getName(), Const.Ships.ORANGE.getValue());
        // generators.ship(this.game, Const.Ships.GRASS.getName(), Const.Ships.GRASS.getValue());
        // generators.ship(this.game, Const.Ships.DARKPINK.getName(), Const.Ships.DARKPINK.getValue());
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
            Assets.Spritesheets.Explosions.Three.getName());
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