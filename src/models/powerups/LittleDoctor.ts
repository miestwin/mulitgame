import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';
import { Bullets, LittleDoctor } from '../bullets';
import { IPowerUp } from './IPowerUp';

export class LittleDoctorPowerUp extends Phaser.Sprite implements IPowerUp {

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
        super(game, x, y, Assets.Images.PowerUps.LittleDoctor.getName());
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
        this._player.bullets = new LittleDoctor(this.game, Assets.Images.Bulelts.Lasers.Laser.getLaser('test1').getName());
        this.kill();
    }

    /**
     * Usunięcie wzmocnienia
     * @memberof MultiWeaponPowerUp
     */
    public remove() {
        this._player.bullets = new Bullets(this.game);
        this.destroy();
    }
}