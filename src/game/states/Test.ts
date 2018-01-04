import "p2";
import "pixi";
import "phaser";

import { Const } from "../../const";
import { CometGroup } from "../../models";

export class Test extends Phaser.State {
  private comets: CometGroup;

  preload() {}

  create() {
    this.game.stage.backgroundColor = "#000000";
    // this.comets = new CometGroup(this.game);
    for (let i = 0; i < Const.Nebula.Names.length; i++) {
      const nebula = this.game.add.tileSprite(
        0,
        0,
        this.game.width,
        this.game.height,
        Const.Nebula.Names[i]
      );
      this.game.world.sendToBack(nebula);
    }

    // this.game.add.tileSprite(
    //   0,
    //   0,
    //   this.game.width,
    //   this.game.height,
    //   "nebula-test"
    // );

    // const starfield = this.game.add.tileSprite(
    //   0,
    //   0,
    //   this.game.width,
    //   this.game.height,
    //   Const.Stars.getName()
    // );
    // this.game.world.sendToBack(starfield);
  }

  update() {
    // this.comets.generate();
  }

  shutdown() {}
}
