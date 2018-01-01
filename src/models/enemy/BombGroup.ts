import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Bomb } from "./Bomb";
import { rnd } from "../../utils";

export class BombGroup extends Phaser.Group {
  constructor(game: Phaser.Game) {
    super(game, game.world, "bombs", false, true, Phaser.Physics.ARCADE);
    for (let i = 0; i < 3; i++) {
      this.add(new Bomb(game, 0, 0, Assets.Images.Enemy.Bomb.getName()));
    }
  }

  public generate() {
    const bomb: Bomb = this.getFirstExists(false);
    const chance = rnd.integerInRange(1, 70);
    if (chance != 1 || !bomb) {
      return;
    }
    const x = this.game.world.width;
    const y = rnd.integerInRange(20, this.game.world.height - 20);
    const sx = rnd.integerInRange(-200, -250);
    const sy = 0;
    bomb.generate(x, y, sx, sy);
  }
}
