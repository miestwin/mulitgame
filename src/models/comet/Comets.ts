import "p2";
import "pixi";
import "phaser";

import { Const } from "../../const";
import { rnd } from "../../utils";
import { Comet } from "./Comet";

export class Comets extends Phaser.Group {
  constructor(game: Phaser.Game) {
    super(game, game.world, "comets", false, true, Phaser.Physics.ARCADE);
    Const.Comet.Names.forEach(name => {
      for (let i = 0; i < 2; i++) {
        this.add(new Comet(game, 0, 0, name));
      }
    });
  }

  public generate() {
    const comet: Comet = this.getFirstExists(false);
    const chance = rnd.integerInRange(1, 70);
    if (chance != 1 || !comet) {
      return;
    }
    const x = this.game.world.width;
    const y = rnd.integerInRange(20, this.game.world.height - 20);
    const sx = rnd.integerInRange(-100, -200);
    const sy = 0;
    comet.generate(x, y, sx, sy);
  }
}
