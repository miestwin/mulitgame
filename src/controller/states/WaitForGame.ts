import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import Network from '../network';

/**
 * Czekanie na rozpoczęcie gry
 * @export
 * @class WaitForGame
 * @extends {Phaser.State}
 */
export class WaitForGame extends Phaser.State {

    /**
     * Wiadomość informująca kiedy zacznie się gra
     * @private
     * @type {Phaser.Text}
     * @memberof MainMenu
     */
    private timer: Phaser.Text;

    preload() {
        this.game.stage.backgroundColor = (<any>this.game.state).color;
        
        Network.onUpdateTimer((sec) => {
            this.timer.setText('The game will start in\n' + sec);
        });

        Network.onStartGame(() => {
            this.game.state.start(States.GAME_CONTROLLER);
        });
    }

    create() {
        this.timer = this.game.add.text(
            this.game.world.centerX, this.game.world.centerY, 'The game will start in\n...',
            {
                font: '35px Kenvector Future',
                fill: '#ffffff',
                align: 'center'
            });
        this.timer.anchor.set(0.5);
    }

    shutdown() {
        Network.removeListener(Network.UPDATE_TIMER);
        Network.removeListener(Network.START_GAME);
    }
}