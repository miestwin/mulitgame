import "p2";
import "pixi";
import "phaser";

import { Player } from "../Player";
import { Assets } from "../../assets";

export class Comet extends Phaser.Sprite {
  private explosion: Phaser.Sprite;

  constructor(game: Phaser.Game, x: number, y: number, key: string) {
    super(game, x, y, key);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.alive = false;
    this.health = 10;
    this.anchor.setTo(0, 0.5);
  }

  /**
   * Generacja komety
   * @param {number} x 
   * @param {number} y 
   * @param {number} sx 
   * @param {number} sy 
   * @memberof Comet
   */
  public generate(x: number, y: number, sx: number, sy: number) {
    this.reset(x, y, 10);
    this.body.velocity.x = sx;
    this.body.velocity.y = sy;
  }
}
