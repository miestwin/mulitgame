import "p2";
import "pixi";
import "phaser";

import { IEnemy } from "./IEnemy";
import { Player } from "../Player";

export class Bomb extends Phaser.Sprite {
  public player: Player;
  public noticeRange: number = 150;

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

  public chceckDistance(player: Player) {
    if (
      this.game.physics.arcade.distanceBetween(player, this) <
        this.noticeRange &&
      this.player == null
    ) {
      this.player = player;
    } else if (
      this.game.physics.arcade.distanceBetween(player, this) <
        this.noticeRange &&
      this.player != null
    ) {
      return;
    } else {
      this.player = null;
    }
  }

  update() {
    if (this.player != null) {
      this.game.physics.arcade.moveToObject(this, this.player, 200);
    }
  }
}
