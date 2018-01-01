import "p2";
import "pixi";
import "phaser";

/**
 * Sprite pocisku
 * @export
 * @class Bullet
 * @extends {Phaser.Sprite}
 */
export class Bullet extends Phaser.Sprite {
  /**
   * Obrażenia zadawane przez pocisk
   * @type {number}
   * @memberof Bullet
   */
  public dmg: number;

  constructor(game: Phaser.Game, key: string, dmg: number) {
    super(game, 0, 0, key);
    this.anchor.set(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.dmg = dmg;
  }

  /**
   * Oddanie strzału
   * @param {number} x 
   * @param {number} y
   * @param {number} speed
   * @param {number} gx 
   * @param {number} gy 
   * @memberof Bullet
   */
  public fire(
    x: number,
    y: number,
    speedX: number,
    speedY: number,
    angle: number,
    gx: number,
    gy: number
  ) {
    this.reset(x, y);
    this.angle = angle;
    this.body.gravity.x = gx;
    this.body.gravity.y = gy;
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
  }
}
