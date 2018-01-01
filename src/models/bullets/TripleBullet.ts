import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Bullet } from "./Bullet";
import { IWeapon } from "./IWeapon";

export class TripleBullet extends Phaser.Group implements IWeapon {
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
  public readonly bulletSpeed: number = 400;

  /**
   * Częstotliwość strzałów
   * @type {number}
   * @memberof SingleBullet
   */
  public readonly fireRate: number = 1800;

  constructor(game: Phaser.Game) {
    super(
      game,
      game.world,
      "triple-bullet",
      false,
      true,
      Phaser.Physics.ARCADE
    );
    for (let i = 0; i < 50; i++) {
      this.add(
        new Bullet(game, Assets.Images.Bulelts.SingleBullet.getName(), 8)
      );
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
    if (this.game.time.now > this._nextFire) {
      const bullet_1: Bullet = this.getFirstExists(false);
      bullet_1.fire(sx, sy, 0, this.bulletSpeed, 270, 0, 0);
      const bullet_2: Bullet = this.getFirstExists(false);
      bullet_2.fire(sx, sy, -this.bulletSpeed, 0, 180, 0, 0);
      const bullet_3: Bullet = this.getFirstExists(false);
      bullet_3.fire(sx, sy, 0, -this.bulletSpeed, 90, 0, 0);
      this._nextFire = this.game.time.now + this.fireRate;
    }
  }
}
