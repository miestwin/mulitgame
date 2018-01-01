import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Bullet } from "./Bullet";
import { IWeapon } from "./IWeapon";

export class LittleDoctor extends Phaser.Group implements IWeapon {
  /**
   * Czy możliwe jest oddanie następnego strału
   * @private
   * @type {number}
   * @memberof LittleDoctor
   */
  private _nextFire: number = 0;
  public get nextFire(): number {
    return this._nextFire;
  }

  /**
   * Prędkość pojeyńczego pocisku
   * @type {number}
   * @memberof LittleDoctor
   */
  public readonly bulletSpeed: number = 1500;

  /**
   * Częstotliwość strzałów
   * @type {number}
   * @memberof LittleDoctor
   */
  public readonly fireRate: number = 1000;

  constructor(game: Phaser.Game, key: string) {
    super(
      game,
      game.world,
      "little-doctor",
      false,
      true,
      Phaser.Physics.ARCADE
    );
    for (let i = 0; i < 20; i++) {
      this.add(new Bullet(game, key, 500));
    }
  }

  /**
   * Oddanie strzału
   * @param {number} sx
   * @param {number} sy 
   * @returns
   * @memberof LittleDoctor
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
