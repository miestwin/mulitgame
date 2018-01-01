import "p2";
import "pixi";
import "phaser";

import { rnd } from "../../utils";
import { Shard } from "./Shard";

export class ShardGroup extends Phaser.Group {
  constructor(game: Phaser.Game) {
    super(game, game.world, "shards", false, true, Phaser.Physics.ARCADE);
    for (let i = 0; i < 10; i++) {
      this.add(new Shard(game, 0, 0));
    }
  }

  public generate(x: number, y: number) {
    const shard: Shard = this.getFirstExists(false);
    if (!shard) {
      return;
    }
    shard.generate(x, y);
  }
}
