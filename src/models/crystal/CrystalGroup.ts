import "p2";
import "pixi";
import "phaser";

import { rnd } from "../../utils";
import { Crystal } from "./Crystal";

export class CrystalGroup extends Phaser.Group {
  constructor(game: Phaser.Game) {
    super(game, game.world, "shards", false, true, Phaser.Physics.ARCADE);
    for (let i = 0; i < 10; i++) {
      this.add(new Crystal(game, 0, 0));
    }
  }

  public generate(x: number, y: number) {
    const shard: Crystal = this.getFirstExists(false);
    if (!shard) {
      return;
    }
    shard.generate(x, y);
  }
}
