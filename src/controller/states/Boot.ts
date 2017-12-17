import "p2";
import "pixi";
import "phaser";

import { States } from "./States";
import { AppAssetsLoader } from "../../core";
import { Assets } from "../../assets";

import Network from "../network";

/**
 * Identyfikator gry
 */
declare var gameId;

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
    Network.onPlayerAssignedSuccessful(() => {
      this.game.state.start(States.LOADING);
    });

    Network.onGameAlreadyStarted(() => {
      const message = "Game already started";
      this.game.state.start(States.MESSAGE, true, false, message);
    });

    Network.onGameFull(() => {
      const message = "Game is full";
      this.game.state.start(States.MESSAGE, true, false, message);
    });

    Network.onGameNotAvailable(() => {
      const message = "Game not available";
      this.game.state.start(States.MESSAGE, true, false, message);
    });

    // load font
    (<any>this.game.load).webfont(
      Assets.Fonts.Kenvector.getName(),
      Assets.Fonts.Kenvector.getFamily()
    );
  }

  create() {
    // assign new game
    Network.newPlayer({ id: (<any>this.game.state).id, gameId: gameId });
  }
}
