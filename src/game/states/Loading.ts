import "p2";
import "pixi";
import "phaser";
import * as QRious from "qrious";
import { States } from "./States";
import config from "../../config";
import * as generators from "../../generators";
import { Assets } from "../../assets";
import { Const } from "../../const";
import { rnd, generateNoise } from "../../utils";

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

    /* spritesheets */
    this.game.load.spritesheet(
      Assets.Spritesheets.Explosions.Comet.getName(),
      Assets.Spritesheets.Explosions.Comet.getPNG(),
      Assets.Spritesheets.Explosions.Comet.getFrameWidth(),
      Assets.Spritesheets.Explosions.Comet.getFrameHeight(),
      Assets.Spritesheets.Explosions.Comet.getFrameMax()
    );

    this.game.load.spritesheet(
      Assets.Spritesheets.Bullets.RGBLaser.getName(),
      Assets.Spritesheets.Bullets.RGBLaser.getPNG(),
      Assets.Spritesheets.Bullets.RGBLaser.getFrameWidth(),
      Assets.Spritesheets.Bullets.RGBLaser.getFrameHeight()
    );

    /* game images */

    this.game.load.image(
      Assets.Images.PowerUps.SplitShoot.getName(),
      Assets.Images.PowerUps.SplitShoot.getPNG()
    );

    this.game.load.image(
      Assets.Images.PowerUps.LittleDoctor.getName(),
      Assets.Images.PowerUps.LittleDoctor.getPNG()
    );

    this.game.load.image(
      Assets.Images.PowerUps.ResetPoints.getName(),
      Assets.Images.PowerUps.ResetPoints.getPNG()
    );

    this.game.load.image(
      Assets.Images.PowerUps.Untouchtable.getName(),
      Assets.Images.PowerUps.Untouchtable.getPNG()
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

    this.game.load.image(
      Assets.Images.Bulelts.SingleBullet.getName(),
      Assets.Images.Bulelts.SingleBullet.getPNG()
    );

    this.game.load.image(
      Assets.Images.Bulelts.Bullet.getName(),
      Assets.Images.Bulelts.Bullet.getPNG()
    );

    this.game.load.image(
      Assets.Images.Bulelts.Lasers.LaserGREEN.getName(),
      Assets.Images.Bulelts.Lasers.LaserGREEN.getPNG()
    );

    this.game.load.image(
      Assets.Images.Bulelts.Lasers.LaserPURPLE.getName(),
      Assets.Images.Bulelts.Lasers.LaserPURPLE.getPNG()
    );

    /* ui */
    this.game.load.image(
      Assets.UI.Buttons.Menu.Grey.getName(),
      Assets.UI.Buttons.Menu.Grey.getPNG()
    );
  }

  create() {
    // create qrcode and go to next state
    this.loadingText.setText("Create Textures ...");
    Promise.all([this.createQRCode(), this.createTextures()])
      .then(() => {
        this.loadingText.setText("Create QRCode Complete");
        this.game.state.start(States.MAIN);
        // this.game.state.start("Test");
      })
      .catch(e => {
        console.log(e);
        this.game.state.start(
          States.MESSAGE,
          true,
          false,
          "Problem with generating texture"
        );
      });
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
        font: `30px ${Assets.Fonts.Kenvector.getFamily()}`,
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

  /**
     * Tworzenie kodu QR
     * @private
     * @returns {Promise<any>} 
     * @memberof Loading
     */
  private createQRCode(): Promise<any> {
    let that = this;
    return new Promise((resolve, reject) => {
      let qr = new QRious({
        value: config.url + "/" + (<any>this.game.state).id,
        background: "#ffffff",
        padding: 20,
        size: 300
      });
      qr = qr.toDataURL("image/jpeg");
      let img = new Image();
      img.onload = () => {
        that.game.cache.addImage("qrcode", img.src, img);
        resolve();
      };
      img.title = (<any>this.game.state).id;
      img.src = qr;
    });
  }

  private createTextures(): Promise<any> {
    return new Promise((resolve, reject) => {
      generators.stars(this.game, 0.02, 0.125, Const.Stars.getName());
      // Const.Nebula.Names.push("nebula-3");
      // generators.nebulaTest(this.game, "nebula-3", Const.Nebula.Colors[0]);
      // Const.Nebula.Names.push("nebula-2");
      // generators.nebulaTest(this.game, "nebula-2", Const.Nebula.Colors[0]);
      // Const.Nebula.Names.push("nebula-4");
      // generators.nebula(
      //   this.game,
      //   "nebula-4",
      //   rnd.integerInRange(0, 1000),
      //   Const.Nebula.Colors[1],
      //   true
      // );
      Const.Nebula.Names.push("nebula-3");
      generators.nebula(
        this.game,
        "nebula-3",
        rnd.integerInRange(0, 1000),
        Const.Nebula.Colors[3],
        true,
        0.3,
        0.05
      );
      // Const.Nebula.Names.push("nebula-2");
      // generators.nebula(
      //   this.game,
      //   "nebula-2",
      //   rnd.integerInRange(0, 1000),
      //   Const.Nebula.Colors[1],
      //   true
      // );
      Const.Nebula.Names.push("nebula-1");
      generators.nebula(
        this.game,
        "nebula-1",
        rnd.integerInRange(0, 1000),
        Const.Nebula.Colors[0],
        false,
        0.4,
        0.05
      );
      // for (let i = 0; i < Const.Nebula.Names.length; i++) {
      // }
      Const.Comet.Names.push("comet-1");
      Const.Comet.Names.push("comet-2");
      Const.Comet.Names.push("comet-3");
      Const.Comet.Names.push("comet-4");
      Const.Comet.Names.push("comet-5");
      Const.Comet.Names.push("comet-6");
      generators.comet(this.game, 200, 80, 20, "comet-1");
      generators.comet(this.game, 150, 40, 10, "comet-2");
      generators.comet(this.game, 200, 60, 15, "comet-3");
      generators.comet(this.game, 160, 50, 12, "comet-4");
      generators.comet(this.game, 170, 55, 13, "comet-5");
      generators.comet(this.game, 100, 20, 5, "comet-6");

      resolve();
    });
  }
}
