import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../../../assets";
import { Bullet } from "./Bullet";
import { IWeapon } from "./IWeapon";

/**
 * Grupa potrójnych pocisków
 * @export
 * @class SplitShot
 * @extends {Phaser.Group}
 * @implements {IWeapon}
 */
export class SplitShot extends Phaser.Group implements IWeapon {
  /**
  * Czy możliwe jest oddanie następnego strału
  * @private
  * @memberof MultipleBullets
  */
  private _nextFire = 0;
  public get nextFire(): number {
    return this._nextFire;
  }

  /**
   * Prędkość pojeyńczego pocisku
   * @memberof SplitShot
   */
  public readonly bulletSpeed = 400;

  /**
   * Częstotliwość strzałów
   * @memberof SplitShot
   */
  public readonly fireRate = 150;

  constructor(game: Phaser.Game) {
    super(game, game.world, "split-shot", false, true, Phaser.Physics.ARCADE);
    for (let i = 0; i < 50; i++) {
      this.add(new Bullet(game, Assets.Images.Bulelts.Bullet.getName(), 1));
    }
  }

  /**
   * Oddanie strzału
   * @param {number} sx 
   * @param {number} sy 
   * @memberof SplitShot
   */
  public fire(sx: number, sy: number) {
    if (this.game.time.now > this._nextFire) {
      const bullet_1: Bullet = this.getFirstExists(false);
      bullet_1.fire(sx + 25, sy, this.bulletSpeed, 0, -100);
      const bullet_2: Bullet = this.getFirstExists(false);
      bullet_2.fire(sx + 25, sy, this.bulletSpeed, 0, 0);
      const bullet_3: Bullet = this.getFirstExists(false);
      bullet_3.fire(sx + 25, sy, this.bulletSpeed, 0, 100);
      this._nextFire = this.game.time.now + this.fireRate;
    }
  }
}
