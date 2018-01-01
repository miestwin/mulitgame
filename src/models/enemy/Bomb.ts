import "p2";
import "pixi";
import "phaser";

import { IEnemy } from "./IEnemy";

export class Bomb extends Phaser.Sprite {
  constructor(game: Phaser.Game, x: number, y: number, key: string) {
    super(game, x, y, key);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.alive = false;
    this.health = 20;
    this.anchor.setTo(0.5);
  }

  public generate(x: number, y: number, sx: number, sy: number) {
    this.reset(x, y, 10);
    this.body.velocity.x = sx;
    this.body.velocity.y = sy;
  }

  update() {}
}
