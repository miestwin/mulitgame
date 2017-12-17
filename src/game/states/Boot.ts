import "p2";
import "pixi";
import "phaser";

import { States } from "./States";

import { AppAssetsLoader } from "../../core";

import Network from "../network";

import { Assets } from "../../assets";

/**
 * Uruchamianie systemu
 * @export
 * @class Boot
 * @extends {Phaser.State}
 */
export class Boot extends Phaser.State {
  init() {
    // set the scale mode
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

    // set custom loader
    this.game.load = new AppAssetsLoader(this.game);
  }

  preload() {
    // initialize response from server
    Network.onGameAssignedSuccessful(() => {
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
    Network.newGame((<any>this.game.state).id);
  }

  shutdown() {
    Network.removeListener(Network.GAME_ASSIGNED_SUCCESSFUL);
  }
}
