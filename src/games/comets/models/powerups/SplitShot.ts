import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../../../assets";
import { Player } from "../Player";
import { SplitShot, SingleBullet } from "../bullets";
import { IPowerUp } from "./IPowerUp";

export class SplitShotPowerUp extends Phaser.Sprite implements IPowerUp {
  public readonly name: string = "Multi Bullets";

  /**
   * Referencja na gracza
   * @private
   * @type {Player}
   * @memberof SplitShotPowerUp
   */
  private _player: Player;

  public get player(): Player {
    return this._player;
  }

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, Assets.Images.PowerUps.SplitShoot.getName());
    this.outOfBoundsKill = true;
    this.anchor.setTo(0.5);
    game.add.existing(this);
    game.physics.arcade.enable(this);
    this.body.velocity.x = -100;
  }

  /**
   * Przydzielenie wzmocnienia
   * @param {Player} player 
   * @param {*} [options] 
   * @memberof SplitShotPowerUp
   */
  public powerup(player: Player, options?: any) {
    this._player = player;
    this._player.weapon = new SplitShot(this.game);
    this.kill();
  }

  /**
   * Usunięcie wzmocnienia
   * @memberof SplitShotPowerUp
   */
  public remove() {
    this._player.weapon = new SingleBullet(this.game);
    this.destroy();
  }
}
