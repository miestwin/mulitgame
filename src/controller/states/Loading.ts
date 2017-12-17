import "p2";
import "pixi";
import "phaser";

import { States } from "./States";
import * as generators from "../../generators";
import { Assets } from "../../assets";
import { Const } from "../../const";

/**
 * Ładowanie zasobów
 * @export
 * @class Loading
 * @extends {Phaser.State}
 */
export class Loading extends Phaser.State {
  private loadingSprite: Phaser.Sprite;
  private loadingText: Phaser.Text;

  preload() {
    this.game.stage.backgroundColor = "#000000";

    this.game.load.onLoadStart.add(this.loadStart, this);
    this.game.load.onFileComplete.add(this.fileComplete, this);
    this.game.load.onLoadComplete.add(this.loadComplete, this);

    /* ui */
    this.game.load.image(
      Assets.UI.Buttons.Joystick.WheelExternal.getName(),
      Assets.UI.Buttons.Joystick.WheelExternal.getPNG()
    );

    this.game.load.image(
      Assets.UI.Buttons.Joystick.WheelInternal.getName(),
      Assets.UI.Buttons.Joystick.WheelInternal.getPNG()
    );

    this.game.load.image(
      Assets.UI.Buttons.Fire.getName(),
      Assets.UI.Buttons.Fire.getPNG()
    );

    this.game.load.image(
      Assets.UI.Buttons.Menu.Grey.getName(),
      Assets.UI.Buttons.Menu.Grey.getPNG()
    );

    this.game.load.image(
      Assets.Images.Transparent.getName(),
      Assets.Images.Transparent.getPNG()
    );

    /* ships */
    this.game.load.image(
      Assets.Images.Ships.GREEN.getName(),
      Assets.Images.Ships.GREEN.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.PURPLE.getName(),
      Assets.Images.Ships.PURPLE.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.BLUE.getName(),
      Assets.Images.Ships.BLUE.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.WATERY.getName(),
      Assets.Images.Ships.WATERY.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.PINK.getName(),
      Assets.Images.Ships.PINK.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.RED.getName(),
      Assets.Images.Ships.RED.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.YELLOW.getName(),
      Assets.Images.Ships.YELLOW.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.ORANGE.getName(),
      Assets.Images.Ships.ORANGE.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.GRASS.getName(),
      Assets.Images.Ships.GRASS.getPNG()
    );

    this.game.load.image(
      Assets.Images.Ships.DARKPINK.getName(),
      Assets.Images.Ships.DARKPINK.getPNG()
    );
  }

  create() {
    this.game.state.start(States.AVATAR_SELECTOR);
  }

  /**
     * Funkcja stanu ładowania
     * Tworzy ekran ładowania
     * Wywoływana jest na początku
     * @private
     * @memberof Loading
     */
  private loadStart() {
    this.loadingText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      "Loading ...",
      {
        font: `20px ${Assets.Fonts.Kenvector.getFamily()}`,
        fill: "#ffffff",
        align: "center"
      }
    );
    this.loadingText.anchor.set(0.5);
  }

  /**
     * Funkcja stanu ładowania
     * Aktualizuje informację o postępach ładowania
     * @private
     * @param {any} progress 
     * @param {any} cacheKey 
     * @param {any} success 
     * @param {any} totalLoaded 
     * @param {any} totalFiles 
     * @memberof Loading
     */
  private fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    this.loadingText.setText(`Loading ${progress}%`);
  }

  /**
     * Funkcja stanu ładowania
     * Informuje o zakończeniu ładowania zasobów
     * @private
     * @memberof Loading
     */
  private loadComplete() {
    this.loadingText.setText("Load Complete");
  }
}
