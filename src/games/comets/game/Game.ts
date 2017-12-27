import "p2";
import "pixi";
import "phaser";

import { States, Boot, Loading, Message, Main } from "./states";
import { Test } from "./states/Test";

import Network from "../../../network";
import { guid } from "../../../utils";

/**
 * Utworzenie gry
 * @export
 * @class Game
 * @extends {Phaser.Game}
 */
export default class Game extends Phaser.Game {
  constructor(config) {
    super(config);
    // create game id
    (<any>this.state).id = guid();
    (<any>this.state).started = false;

    // connect to server
    Network.connect();

    // add states to game
    this.state.add(States.BOOT, Boot);
    this.state.add(States.LOADING, Loading);
    this.state.add(States.MESSAGE, Message);
    this.state.add(States.MAIN, Main);

    this.state.add("Test", Test);
    this.state.start(States.BOOT);
  }
}
