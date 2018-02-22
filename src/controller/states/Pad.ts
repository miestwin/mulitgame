import "p2";
import "pixi";
import "phaser";

import { States } from "./States";
import { Player } from "../../models";
import Network from "../network";
import { Assets } from "../../assets";
import { colorLuminance } from "../../utils";

declare var Victor;
declare var gameId;

/**
 * Kontroler gry
 * @export
 * @class GameController
 * @extends {Phaser.State}
 */
export class Pad extends Phaser.State {
  /**
   * Identyfikator zdarzenia dla lewej części kontrolera
   * @private
   * @type {number}
   * @memberof GameController
   */
  private leftTouchID: number;

  /**
   * Wektor pozycji początkowej kontolera
   * @private
   * @memberof GameController
   */
  private leftTouchStartPos = new Victor(0, 0);

  /**
   * Wektor aktualnej pozycji kontolera
   * @private
   * @memberof GameController
   */
  private leftTouchPos = new Victor(0, 0);

  /**
   * Wektor pozycji gracza
   * @private
   * @memberof GameController
   */
  private leftVector = new Victor(0, 0);

  /**
   * Pad do sterowania statkiem
   * @private
   * @type {Phaser.Image}
   * @memberof GameController
   */
  private leftPad: Phaser.Image;

  /**
   * Wiadomość o zdobytych punktach
   * @private
   * @type {Phaser.Text}
   * @memberof GameController
   */
  private scoreText: Phaser.Text;

  /**
     * Oddanie strzału
     * @private
     * @type {Phaser.Button}
     * @memberof GameController
     */
  private fireBtn: Phaser.Button;

  private frameCounter: number = 0;

  preload() {
    this.game.stage.backgroundColor = (<any>this.game.state).color;

    Network.onUpdateScore((score: number, vibration: boolean) => {
      this.scoreText.setText(score.toString());
      if (vibration) {
        this.signalPointsLost();
      }
    });

    Network.onEndGame((playerId: string) => {
      const message = playerId == (<any>this.game.state).id ? "Win" : "Lose";
      this.game.state.start(States.MESSAGE, true, false, message, true, () => {
        Network.playAgain(gameId);
        this.game.state.start(States.SELECTOR);
      });
    });

    document
      .getElementById("controller")
      .addEventListener("touchstart", this.onTouchStart.bind(this));
    document
      .getElementById("controller")
      .addEventListener("touchmove", this.onTouchMove.bind(this));
    document
      .getElementById("controller")
      .addEventListener("touchend", this.onTouchEnd.bind(this));
  }

  create() {
    this.leftTouchStartPos = new Victor(
      this.game.world.centerX / 2,
      this.game.world.centerY
    );
    this.leftTouchPos.copy(this.leftTouchStartPos);

    this.scoreText = this.game.add.text(
      this.game.world.centerX + this.game.world.centerX / 2,
      50,
      "Sync",
      {
        font: `35px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    this.scoreText.anchor.setTo(0.5);

    const color = parseInt(
      colorLuminance((<any>this.game.state).color, -0.2).replace("#", ""),
      16
    );
    const graphics = this.game.add.graphics(0, 0);
    graphics.beginFill(color);
    graphics.drawCircle(100, 100, 200);
    graphics.endFill();
    graphics.beginFill(0xffffff);
    graphics.drawCircle(100, 30, 10);
    graphics.drawCircle(170, 100, 10);
    graphics.drawCircle(100, 170, 10);
    graphics.drawCircle(30, 100, 10);
    graphics.endFill();

    const leftPadBack = this.game.add.image(
      this.leftTouchStartPos.x,
      this.leftTouchStartPos.y,
      graphics.generateTexture()
    );
    leftPadBack.anchor.setTo(0.5);
    graphics.destroy();
    this.leftPad = this.game.add.image(
      this.leftTouchStartPos.x,
      this.leftTouchStartPos.y,
      Assets.UI.Buttons.Joystick.WheelInternal.getName()
    );
    this.leftPad.anchor.setTo(0.5);
    this.leftPad.scale.setTo(0.5);

    this.fireBtn = this.game.add.button(
      this.game.world.centerX + this.game.world.centerX / 2,
      this.game.world.centerY,
      Assets.UI.Buttons.Fire.getName(),
      () => {
        Network.playerFire(gameId);
      },
      this
    );
    this.fireBtn.scale.setTo(1.3);
    this.fireBtn.anchor.setTo(0.5);
  }

  update() {
    this.leftPad.x = this.leftTouchPos.x;
    this.leftPad.y = this.leftTouchPos.y;
    this.frameCounter++;
    if (this.frameCounter % 3 === 0) {
      Network.updatePlayerXY(gameId, {
        x: this.leftVector.x,
        y: this.leftVector.y
      });
    }
  }

  shutdown() {
    document
      .getElementById("controller")
      .removeEventListener("touchstart", this.onTouchStart.bind(this));
    document
      .getElementById("controller")
      .removeEventListener("touchmove", this.onTouchMove.bind(this));
    document
      .getElementById("controller")
      .removeEventListener("touchend", this.onTouchEnd.bind(this));
    Network.removeListener(Network.UPDATE_PLAYER_SCORE);
  }

  private signalPointsLost() {
    window.navigator.vibrate(500);
  }

  private onTouchStart(e: TouchEvent) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.clientX < this.game.world.centerX) {
        this.leftTouchID = touch.identifier;
        this.leftTouchPos.copy(this.leftTouchStartPos);
        this.leftVector = new Victor(0, 0);
        break;
      }
    }
  }

  private onTouchMove(e: TouchEvent) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier == this.leftTouchID) {
        this.leftTouchPos = new Victor(touch.clientX, touch.clientY);
        if (Math.abs(this.leftTouchStartPos.distance(this.leftTouchPos)) > 90) {
          this.leftTouchPos.subtract(this.leftTouchStartPos);
          this.leftTouchPos.normalize();
          this.leftTouchPos.multiply(new Victor(90, 90));
          this.leftTouchPos.add(this.leftTouchStartPos);
        }
        this.leftVector.copy(this.leftTouchPos);
        this.leftVector.subtract(this.leftTouchStartPos);
        break;
      }
    }
  }

  private onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier == this.leftTouchID) {
        this.leftTouchID = -1;
        this.leftTouchPos.copy(this.leftTouchStartPos);
        break;
      }
    }
  }
}
