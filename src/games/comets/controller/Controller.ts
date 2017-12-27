import "p2";
import "pixi";
import "phaser";

import {
  States,
  Boot,
  Loading,
  AvatarSelector,
  Message,
  GameController
} from "./states";

import Network from "../../../network";
import { guid } from "../../../utils";

/**
 * Utworzenie kontrolera
 * @export
 * @class Controller
 * @extends {Phaser.Game}
 */
export default class Controller extends Phaser.Game {
  constructor(config) {
    super(config);
    // create controller id
    (<any>this.state).id = guid();
    (<any>this.state).color = null;

    // connect to server
    Network.connect();

    // add states to controller
    this.state.add(States.BOOT, Boot);
    this.state.add(States.LOADING, Loading);
    this.state.add(States.AVATAR_SELECTOR, AvatarSelector);
    this.state.add(States.MESSAGE, Message);
    this.state.add(States.GAME_CONTROLLER, GameController);

    this.state.start(States.BOOT);
  }
}
