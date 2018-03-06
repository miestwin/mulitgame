import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Bullet } from "./Bullet";
import { IWeapon } from "./IWeapon";

/**
 * Grupa pojedyńczych pocisków
 * @export
 * @class SingleBullet
 * @extends {Phaser.Group}
 * @implements {IWeapon}
 */
export class SingleBullet extends Phaser.Group implements IWeapon {
  /**
   * Czy możliwe jest oddanie następnego strzału
   * @private
   * @type {number}
   * @memberof SingleBullet
   */
  private _nextFire: number = 0;
  public get nextFire(): number {
    return this._nextFire;
  }

  /**
   * Prędkość pojeyńczego pocisku
   * @type {number}
   * @memberof SingleBullet
   */
  public readonly bulletSpeed: number = 600;

  /**
   * Częstotliwość strzałów
   * @type {number}
   * @memberof SingleBullet
   */
  public readonly fireRate: number = 50;

  constructor(game: Phaser.Game) {
    super(
      game,
      game.world,
      "single-bullet",
      false,
      true,
      Phaser.Physics.ARCADE
    );
    for (let i = 0; i < 40; i++) {
      const bullet = new Bullet(
        game,
        Assets.Images.Bulelts.GreenLaser.getName(),
        2
      );
      bullet.scale.setTo(0.5);
      this.add(bullet);
    }
  }

  /**
   * Oddanie strzału
   * @param {number} sx 
   * @param {number} sy 
   * @returns 
   * @memberof SingleBullet
   */
  public fire(sx: number, sy: number) {
    const bullet: Bullet = this.getFirstExists(false);
    if (!bullet) {
      return;
    }
    if (this.game.time.now > this._nextFire) {
      bullet.fire(sx + 20, sy, this.bulletSpeed, 0, 0, 0, 0);
      this._nextFire = this.game.time.now + this.fireRate;
    }
  }
}
