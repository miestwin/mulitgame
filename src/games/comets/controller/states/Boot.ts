import "p2";
import "pixi";
import "phaser";

import { States } from "./States";
import { AppAssetsLoader } from "../../../../core";
import { Assets } from "../../../../assets";
import * as actions from "../../../../../actions";
import Network from "../../../../network";

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
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    // set custom loader
    this.game.load = new AppAssetsLoader(this.game);
  }

  preload() {
    // initialize response from server
    Network.onPlayerJoined(() => {
      this.game.state.start(States.LOADING);
    });

    Network.onGameHasStarted(() => {
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

    Network.onGameInvalid(() => {
      const message = "Game invalid";
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
    Network.newPlayer({ playerId: (<any>this.game.state).id, gameId: gameId });
  }

  shutdown() {
    Network.removeListener(actions.PLAYER_JOINED);
  }
}
