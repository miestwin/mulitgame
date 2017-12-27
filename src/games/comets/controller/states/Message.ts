import "p2";
import "pixi";
import "phaser";

import { States } from "./States";
import Network from "../../../../network";
import { Assets } from "../../../../assets";

declare var gameId;

/**
 * Wyświetlanie wiadomości z błędami
 * @export
 * @class Message
 * @extends {Phaser.State}
 */
export class Message extends Phaser.State {
  /**
     * Wiadomość dla gracza
     * @private
     * @type {string}
     * @memberof Message
     */
  private message: string;

  /**
     * Tekst na przycisku
     * @private
     * @type {string}
     * @memberof Message
     */
  private btn: boolean;

  /**
     * Akcja przycisku
     * @private
     * @type {Function}
     * @memberof Message
     */
  private action: Function;

  init(message: string, btn?: boolean, action?: Function) {
    this.message = message;
    this.btn = btn ? btn : null;
    this.action = action ? action.bind(this) : null;
  }

  preload() {}

  create() {
    this.game.stage.backgroundColor = "#23292d";

    var message = this.game.add.text(
      this.game.world.centerX,
      this.btn ? this.game.world.centerY - 50 : this.game.world.centerY,
      this.message,
      {
        font: `35px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    message.anchor.set(0.5);
    if (this.btn && this.action) {
      var button = this.game.add.button(
        this.game.world.centerX,
        this.game.world.centerY + 30,
        Assets.UI.Buttons.Menu.Start.getName(),
        this.action,
        this,
        2,
        1,
        0
      );
      button.anchor.set(0.5);
    }
  }
}
