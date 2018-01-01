import "p2";
import "pixi";
import "phaser";

import { IEnemy } from "./IEnemy";
import { IWeapon, TripleBullet } from "../bullets";

export class Ufo extends Phaser.Sprite implements IEnemy {
  weapon: IWeapon;

  constructor(game: Phaser.Game, x: number, y: number, key: string) {
    super(game, x, y, key);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.alive = false;
    this.health = 10;
    this.anchor.setTo(0.5, 0.5);
    this.weapon = new TripleBullet(game);
  }

  public generate(x: number, y: number, sx: number, sy: number) {
    this.reset(x, y, 10);
    this.body.velocity.x = sx;
    this.body.velocity.y = sy;
  }

  public fire() {
    this.weapon.fire(this.x, this.y);
  }

  update() {
    if (this.alive) {
      this.fire();
    }
  }
}
