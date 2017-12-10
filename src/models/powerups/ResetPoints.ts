import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';
import { IPowerUp } from './IPowerUp';

export class ResetPointsPowerUp extends Phaser.Sprite implements IPowerUp {

    /**
     * Referencja na gracza
     * @private
     * @type {Player}
     * @memberof MultiWeaponPowerUp
     */
    private _player: Player;

    public get player(): Player {
        return this._player;
    }

    /**
     * Akcja do wykonania podczas otrzymania wzmocnienia
     * @private
     * @type {Function}
     * @memberof ResetPointsPowerUp
     */
    private callback: Function;

    constructor(game: Phaser.Game, x: number, y: number, callback: Function) {
        super(game, x, y, Assets.Images.PowerUps.ResetPoints.getName());
        this.anchor.setTo(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.callback = callback;
    }

    /**
     * Przydzielenie wzmocnienia
     * @param {Player} player 
     * @param {*} [options] 
     * @memberof MultiWeaponPowerUp
     */
    public powerup(player: Player, options?: any) {
        this._player = player;
        this._player.score = 0;
        this.kill();
        this.callback(this._player);
    }

    /**
     * Usunięcie wzmocnienia
     * @memberof MultiWeaponPowerUp
     */
    public remove() {
        this.destroy();
    }
}