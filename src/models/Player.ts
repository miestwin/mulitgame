import "p2";
import "pixi";
import "phaser";

import { IWeapon, SingleBullet } from "./bullets";
import { IPowerUp } from "./powerups";
import { Assets } from "../assets";

declare var Victor;

export class Player extends Phaser.Sprite {
  /**
   * Identyfikator
   * @private
   * @type {string}
   * @memberof Player
   */
  private _id: string;
  get id() {
    return this._id;
  }

  /**
   * Identyfikator socket
   * @private
   * @type {string}
   * @memberof Player
   */
  private _socketId: string;
  get socket() {
    return this._socketId;
  }

  /**
   * Wynik
   * @type {number}
   * @memberof Player
   */
  public score: number;

  /**
   * Wektor przesunięcia
   * @memberof Player
   */
  public vector: any;

  /**
   * Czy gracz jest nie tykalny
   * @type {boolean}
   * @memberof Player
   */
  public untouchtable: boolean;

  /**
   * Aktualna broń gracza
   * @type {IBullets}
   * @memberof Player
   */
  public weapon: IWeapon;

  /**
   * Wzmocnienia gracza
   * @type {IPowerUp[]}
   * @memberof Player
   */
  public powerups: IPowerUp[] = [];

  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    { id, socketId, avatar }
  ) {
    super(game, x, y, avatar);
    this._id = id;
    this._socketId = socketId;
    this.score = 0;
    this.untouchtable = false;
    this.vector = new Victor(0, 0);
    this.anchor.setTo(0.5);
    this.scale.setTo(0.4);
    game.add.existing(this);
    game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.weapon = new SingleBullet(game);
  }

  /**
   * Ustawia X i Y grafiki
   * @param {number} x 
   * @param {number} y 
   * @memberof Player
   */
  public setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Aktualizacja gracza
   * @memberof Player
   */
  public update() {
    this.body.velocity.x = this.vector.x * 6;
    this.body.velocity.y = this.vector.y * 6;

    if (this.untouchtable) {
      this.alpha = 0.5;
    } else {
      this.alpha = 1;
    }
  }

  /**
   * Oddanie strzału
   * @memberof Player
   */
  public fire() {
    this.weapon.fire(this.x, this.y);
  }

  /**
   * Usunięcie wzmocnień
   * @memberof Player
   */
  public removePowerups() {
    this.powerups.forEach((powerup: IPowerUp) => {
      powerup.remove();
    });
    this.powerups = [];
  }
}
