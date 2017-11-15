import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';
import { Player } from '../../models';
import Network from '../network';
import { Assets } from '../../assets';

declare var Victor;
declare var HealthBar;
declare var gameId;

/**
 * Kontroler gry
 * @export
 * @class GameController
 * @extends {Phaser.State}
 */
export class GameController extends Phaser.State {

    /**
     * Grafika do rysowania kontrolera
     * @private
     * @type {Phaser.Graphics}
     * @memberof GameController
     */
    private graphics: Phaser.Graphics;

    /**
     * Zdarzenia z touch device
     * @private
     * @type {TouchList}
     * @memberof GameController
     */
    private tpCache: Touch;

    /**
     * Identyfikator zdarzenia dla lewej części kontrolera
     * @private
     * @type {number}
     * @memberof GameController
     */
    private leftTouchID: number;

    /**
     * Wektor pozycji początkowej kontolera
     * @private
     * @memberof GameController
     */
    private leftTouchStartPos = new Victor(0, 0);

    /**
     * Wektor aktualnej pozycji kontolera
     * @private
     * @memberof GameController
     */
    private leftTouchPos = new Victor(0, 0);


    /**
     * Wektor pozycji gracza
     * @private
     * @memberof GameController
     */
    private leftVector = new Victor(0, 0);

    /**
     * Pad do sterowania statkiem
     * @private
     * @type {Phaser.Image}
     * @memberof GameController
     */
    private leftPad: Phaser.Image;

    /**
     * Wiadomość o zdobytych punktach
     * 
     * @private
     * @type {Phaser.Text}
     * @memberof GameController
     */
    private scoreText: Phaser.Text;

    /**
     * Włączenie tarczy
     * @private
     * @type {Phaser.Button}
     * @memberof GameController
     */
    private shieldBtn: Phaser.Button;

    /**
     * Oddanie strzału
     * @private
     * @type {Phaser.Button}
     * @memberof GameController
     */
    private fireBtn: Phaser.Button;

    /**
     * Interwał wibracji
     * @private
     * @memberof GameController
     */
    private vibrateInterval;

    private shieldState = { canUse: true, inUse: false, duration: 0, intensity: 0 };

    private shieldUPTimer: Phaser.Timer;
    private shieldOverpoweredTimer: Phaser.Timer;
    private shieldBar;

    private frameCounter: number = 0;

    preload() {
        this.game.stage.backgroundColor = (<any>this.game.state).color;

        Network.onUpdateScore((score) => {
            this.scoreText.setText('Score: ' + score);
        });

        // odliczanie czasu użycia tarczy
        this.shieldUPTimer = this.game.time.create(true);
        this.shieldUPTimer.loop(4000, this.shieldUpTimerHandler, this);

        // odliczanie przeciążenia tarczy
        this.shieldOverpoweredTimer = this.game.time.create(true);
        this.shieldOverpoweredTimer.loop(2000, () => {
            Network.updatePlayerZ(gameId, false);
            this.shieldState.canUse = false;
            this.stopShieldUP();
            setTimeout(() => {
                this.shieldState.canUse = true;
            }, 1000);
            this.shieldOverpoweredTimer.stop();
        }, this);

        document.getElementById('controller').addEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').addEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    create() {
        this.leftTouchStartPos = new Victor(this.game.world.centerX / 2, this.game.world.centerY);
        this.leftTouchPos.copy(this.leftTouchStartPos);
        
        this.scoreText = this.game.add.text(
            this.game.world.centerX / 2, 10, 'Score: 0',
            { font: `25px ${Assets.Fonts.Kenvector.getFamily()}`, fill: '#ffffff', align: 'center' });
        this.scoreText.anchor.setTo(0.5, 0);

        const leftPadBack = this.game.add.image(
            this.leftTouchStartPos.x, 
            this.leftTouchStartPos.y, 
            Assets.UI.Buttons.Joystick.WheelExternal.getName());
        leftPadBack.anchor.setTo(0.5);
        leftPadBack.scale.setTo(2);

        this.leftPad = this.game.add.image(
            this.leftTouchStartPos.x, 
            this.leftTouchStartPos.y, 
            Assets.UI.Buttons.Joystick.WheelInternal.getName());
        this.leftPad.anchor.setTo(0.5);
        this.leftPad.scale.setTo(0.5);

        this.shieldBtn = this.game.add.button(
            this.game.world.centerX + this.game.world.centerX / 2,
            this.game.world.centerY - 10, 
            Assets.UI.Buttons.Shield.getName());
        this.shieldBtn.anchor.setTo(0.5, 1);

        this.shieldBtn.onInputDown.add(() => {
            if (this.shieldState.canUse) {
                Network.updatePlayerZ(gameId, true);
                this.shieldUPTimer.start();
            }
        }, this);

        this.shieldBtn.onInputUp.add(() => {
            if (this.shieldState.canUse) {
                Network.updatePlayerZ(gameId, false);
                this.shieldUPTimer.stop();
                this.shieldOverpoweredTimer.stop();
                this.shieldState.canUse = false;
                this.stopShieldUP();
                setTimeout(() => {
                    this.shieldState.canUse = true;
                }, 5000);
            }
        }, this);

        this.fireBtn = this.game.add.button(
            this.game.world.centerX + this.game.world.centerX / 2,
            this.game.world.centerY + 10, Assets.UI.Buttons.Fire.getName(),
            () => {
                Network.playerFire(gameId);
            }, this);

        this.shieldBar = new HealthBar(this.game, {
            x: this.game.world.centerX + (this.game.world.centerX / 2), y: 10, width: 200, height: 25,
            bg: { color: '#808080' }, bar: { color: '#ffffff' },
            animationDuration: 200, flipped: false
        });
    }

    update() {
        this.leftPad.x = this.leftTouchPos.x;
        this.leftPad.y = this.leftTouchPos.y;
        this.frameCounter++;
        if (this.frameCounter % 3 === 0) {
            Network.updatePlayerXY(gameId, { x: this.leftVector.x, y: this.leftVector.y });
        }
    }

    shutdown() {
        document.getElementById('controller').removeEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').removeEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').removeEventListener('touchend', this.onTouchEnd.bind(this));
        Network.removeListener(Network.UPDATE_PLAYER_SCORE);
    }

    private shieldUpTimerHandler() {
        this.shieldBar.setPercent(70);
        this.setVibrationInterval();
        this.shieldOverpoweredTimer.start();
        this.shieldUPTimer.stop();
    }

    private setVibrationInterval() {
        this.vibrateInterval = setInterval(() => {
            this.shieldState.intensity += 0.005;
            this.shieldState.duration += 1;
            let duration = [];
            for (let i = 0; i < this.shieldState.duration; i++) {
                duration.push(450 / i);
                duration.push(50 / i);
            }
            this.signalShieldOverpowered(duration, this.shieldState.intensity);
        }, 500);
    }

    private signalShieldOverpowered(duration: Array<number>, intensity: number) {
        window.navigator.vibrate(duration);
        this.game.camera.shake(intensity, 490);
    }

    private stopShieldUP() {
        if (this.vibrateInterval) {
            clearInterval(this.vibrateInterval);
            this.vibrateInterval = null;
        }
        window.navigator.vibrate(0);
        this.shieldState.duration = 0;
        this.shieldState.intensity = 0;
    }

    private onTouchStart(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.clientX < this.game.world.centerX) {
                this.leftTouchID = touch.identifier;
                this.leftTouchPos.copy(this.leftTouchStartPos);
                this.leftVector = new Victor(0, 0);
                break;
            }
        }
    }

    private onTouchMove(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier == this.leftTouchID) {
                this.leftTouchPos = new Victor(touch.clientX, touch.clientY);
                if (Math.abs(this.leftTouchStartPos.distance(this.leftTouchPos)) > 90) {
                    this.leftTouchPos.subtract(this.leftTouchStartPos);
                    this.leftTouchPos.normalize();
                    this.leftTouchPos.multiply(new Victor(90, 90));
                    this.leftTouchPos.add(this.leftTouchStartPos);
                } 
                this.leftVector.copy(this.leftTouchPos);
                this.leftVector.subtract(this.leftTouchStartPos);
                break;
            }
        }
    }

    private onTouchEnd(e: TouchEvent) {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier == this.leftTouchID) {
                this.leftTouchID = -1;
                this.leftTouchPos.copy(this.leftTouchStartPos);
                break;
            }
        }
    }
}