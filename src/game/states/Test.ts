import "p2";
import "pixi";
import "phaser";

import { Const } from "../../const";
import { rnd } from "../../utils";
import * as generators from "../../generators";

export class Test extends Phaser.State {
  preload() {}

  create() {
    for (let i = 0; i < Const.Nebula.Names.length; i++) {
      const nebula = this.game.add.tileSprite(
        0,
        0,
        this.game.width,
        this.game.height,
        Const.Nebula.Names[i]
      );
      this.game.world.sendToBack(nebula);
      nebula.autoScroll(-100 + 50 * i, 0);
    }
    const starfield = this.game.add.tileSprite(
      0,
      0,
      this.game.width,
      this.game.height,
      Const.Stars.getName()
    );
    this.game.world.sendToBack(starfield);
    starfield.autoScroll(-50, 0);
  }

  shutdown() {}
}
