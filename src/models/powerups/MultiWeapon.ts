import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';
import { Bullets, MultipleBullets } from '../bullets';
import { IPowerUp } from './IPowerUp';

export class MultiWeaponPowerUp extends Phaser.Sprite implements IPowerUp {

    public readonly name: string = 'Multi Bullets';

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
        super(game, x, y, Assets.Images.PowerUps.MultiWeapon.getName());
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
        this._player.bullets = new MultipleBullets(this.game);
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