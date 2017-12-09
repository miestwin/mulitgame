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

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Images.PowerUps.ResetPoints.getName());
        this.anchor.setTo(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
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
    }

    /**
     * Usunięcie wzmocnienia
     * @memberof MultiWeaponPowerUp
     */
    public remove() {
        this.destroy();
    }
}