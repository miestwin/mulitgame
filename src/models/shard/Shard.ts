import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";

export class Shard extends Phaser.Sprite {
  readonly points = 50;
  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, Assets.Images.Shard.getName());
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.alive = false;
  }

  public generate(x: number, y: number) {
    this.reset(x, y);
    this.body.velocity.x = -100;
  }
}
