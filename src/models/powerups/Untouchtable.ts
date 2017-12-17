import "p2";
import "pixi";
import "phaser";

import { Assets } from "../../assets";
import { Player } from "../Player";
import { IPowerUp } from "./IPowerUp";

export class UntouchtablePowerUp extends Phaser.Sprite implements IPowerUp {
  public readonly name: string = "Untouchtable";

  /**
   * Referencja na gracza
   * @private
   * @type {Player}
   * @memberof UntouchtablePowerUp
   */
  private _player: Player;

  public get player(): Player {
    return this._player;
  }

  constructor(game: Phaser.Game, x: number, y: number) {
    super(game, x, y, Assets.Images.PowerUps.Untouchtable.getName());
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
   * @memberof UntouchtablePowerUp
   */
  public powerup(player: Player, options?: any) {
    this._player = player;
    this._player.untouchtable = true;
    this.kill();
  }

  /**
   * Usunięcie wzmocnienia
   * @memberof UntouchtablePowerUp
   */
  public remove() {
    this._player.untouchtable = false;
    this.destroy();
  }
}
