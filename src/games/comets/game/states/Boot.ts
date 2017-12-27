import "p2";
import "pixi";
import "phaser";

import Network from "../../../../network";
import * as actions from "../../../../../actions";
import { Assets } from "../../../../assets";
import { AppAssetsLoader } from "../../../../core";
import { States } from "./States";

/**
 * Uruchamianie systemu
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class Boot extends Phaser.State {
  init() {
    // set the scale mode
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    // set custom loader
    this.game.load = new AppAssetsLoader(this.game);
  }

  preload() {
    Network.onGameInvalid(data => {
      this.game.state.start(States.MESSAGE, true, false, "Game invalid");
    });

    Network.onUpdateGameState(data => {
      this.game.state.start(States.LOADING);
    });

    // load font
    (<any>this.game.load).webfont(
      Assets.Fonts.Kenvector.getName(),
      Assets.Fonts.Kenvector.getFamily()
    );
  }

  create() {
    // assign new game
    console.log((<any>this.game.state).id);
    Network.newGame({ gameId: (<any>this.game.state).id, name: "Comets" });
  }

  shutdown() {
    Network.removeListener(actions.GAME_INVALID);
    Network.removeListener(actions.UPDATE_GAME_STATE);
  }
}
