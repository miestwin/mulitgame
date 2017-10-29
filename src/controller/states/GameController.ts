import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

declare var Victor;
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
     * Przycisk do wznoszenia statku
     * @private
     * @type {Phaser.Button}
     * @memberof GameController
     */
    private upBtn: Phaser.Button;

    /**
     * Przycisk do opadania statku
     * @private
     * @type {Phaser.Button}
     * @memberof GameController
     */
    private downBtn: Phaser.Button;

    private frameCounter: number = 0;

    preload() {
        this.game.stage.backgroundColor = (<any>this.game.state).color;

        Network.onUpdateScore((score) => {
            this.scoreText.setText('Score: ' + score);
        });

        document.getElementById('controller').addEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').addEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    create() {
        this.leftTouchStartPos = new Victor(this.game.world.centerX / 2, this.game.world.centerY);
        this.leftTouchPos.copy(this.leftTouchStartPos);
        
        this.scoreText = this.game.add.text(
            this.game.world.centerX,
            18, 'Score: 500',
            { font: '25px Kenvector Future', fill: '#ffffff', align: 'center' });
        this.scoreText.anchor.setTo(0.5, 0);

        this.upBtn = this.game.add.button(
            this.game.world.centerX + this.game.world.centerX / 2,
            this.game.world.centerY / 2, 'up');

        this.upBtn.onInputDown.add(() => {
            Network.updatePlayerZ(gameId, 1);
        }, this);

        this.upBtn.onInputUp.add(() => {
            Network.updatePlayerZ(gameId, 0);
        }, this);

        this.downBtn = this.game.add.button(
            this.game.world.centerX + this.game.world.centerX / 2,
            this.game.world.centerY + this.game.world.centerY / 2, 'down');
        this.downBtn.anchor.setTo(1);

        this.downBtn.onInputDown.add(() => {
            Network.updatePlayerZ(gameId, -1);
        }, this);

        this.downBtn.onInputUp.add(() => {
            Network.updatePlayerZ(gameId, 0);
        }, this);

        const leftPadBack = this.game.add.image(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 'left-1');
        leftPadBack.anchor.setTo(0.5);
        leftPadBack.scale.setTo(2);

        this.leftPad = this.game.add.image(this.leftTouchStartPos.x, this.leftTouchStartPos.y, 'left-2');
        this.leftPad.anchor.setTo(0.5);
        this.leftPad.scale.setTo(0.5);
    }

    update() {
        this.leftPad.x = this.leftTouchPos.x;
        this.leftPad.y = this.leftTouchPos.y;
        this.frameCounter++;
        if (this.frameCounter % 2 === 0) {
            Network.updatePlayerXY(gameId, { x: this.leftVector.x, y: this.leftVector.y });
        }
    }

    shutdown() {
        document.getElementById('controller').removeEventListener('touchstart', this.onTouchStart.bind(this));
        document.getElementById('controller').removeEventListener('touchmove', this.onTouchMove.bind(this));
        document.getElementById('controller').removeEventListener('touchend', this.onTouchEnd.bind(this));
        Network.removeListener(Network.UPDATE_PLAYER_SCORE);
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