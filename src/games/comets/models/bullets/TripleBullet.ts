import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../../../assets";
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
  public readonly bulletSpeed: number = 100;

  /**
   * Częstotliwość strzałów
   * @type {number}
   * @memberof SingleBullet
   */
  public readonly fireRate: number = 400;

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
        new Bullet(game, Assets.Images.Bulelts.SingleBullet.getName(), 2)
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
    const bullet_1: Bullet = this.getFirstExists(false);
    if (bullet_1) bullet_1.fire(sx, sy, this.bulletSpeed, 270, 0, 0);
    const bullet_2: Bullet = this.getFirstExists(false);
    if (bullet_2) bullet_2.fire(sx, sy, this.bulletSpeed, 180, 0, 0);
    const bullet_3: Bullet = this.getFirstExists(false);
    if (bullet_3) bullet_3.fire(sx, sy, this.bulletSpeed, 90, 0, 0);
    this._nextFire = this.game.time.now + this.fireRate;
  }
}
