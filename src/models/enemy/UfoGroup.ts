import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Ufo } from "./Ufo";
import { rnd } from "../../utils";

export class UfoGroup extends Phaser.Group {
  constructor(game: Phaser.Game) {
    super(game, game.world, "ufos", false, true, Phaser.Physics.ARCADE);
    for (let i = 0; i < 3; i++) {
      this.add(new Ufo(game, 0, 0, Assets.Images.Enemy.Ufo.getName()));
    }
  }

  public generate() {
    const ufo: Ufo = this.getFirstExists(false);
    const chance = rnd.integerInRange(1, 70);
    if (chance != 1 || !ufo) {
      return;
    }
    const x = this.game.world.width;
    const y = rnd.integerInRange(20, this.game.world.height - 20);
    const sx = rnd.integerInRange(-200, -250);
    const sy = 0;
    ufo.generate(x, y, sx, sy);
  }
}
