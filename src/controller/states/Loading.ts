import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

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

        this.game.load.image('left-1', '../assets/images/controller/Sprites/lineDark/lineDark46.png');
        this.game.load.image('left-2', '../assets/images/controller/Sprites/shadedDark/shadedDark11.png');
        this.game.load.image('up', '../assets/images/controller/Sprites/shadedDark/shadedDark26.png');
        this.game.load.image('down', '../assets/images/controller/Sprites/shadedDark/shadedDark27.png');

        this.game.load.image('transparent', '../assets/spritesheets/gui/transparent.png');

        this.game.load.image('grey-button-04', '../assets/spritesheets/gui/ui/PNG/grey_button04.png');
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
                font: '20px Kenvector Future',
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