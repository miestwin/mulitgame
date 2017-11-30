import 'p2';
import 'pixi';
import 'phaser';

import { Shield } from './Shield';

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
     * @private
     * @type {number}
     * @memberof Player
     */
    public score: number;

    /**
     * Wektor przesunięcia
     * @memberof Player
     */
    public vector;

    /**
     * Pozycja z gracza
     * @type {boolean}
     * @memberof Player
     */
    public zPos: boolean; 

    public shield: Shield;

    public weapon: Phaser.Weapon;

    public MAX_SCALE = 1.6;

    public MIN_SCALE = 0;

    public DEFAULT_SCALE = 1;

    public SCALE_STEP = 0.02;

    constructor(game: Phaser.Game, x: number, y: number, { id, socketId, avatar }) {
        super(game, x, y, avatar);
        this._id = id;
        this._socketId = socketId;
        this.score = 0;
        this.zPos = false;
        this.vector = new Victor(0, 0);
        this.angle = 0;
        this.anchor.setTo(0.5);
        this.scale.setTo(0.6);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
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

    public update() {
        if ((<any>this.game.state).started) {
            this.body.velocity.x = this.vector.x * 9;
            this.body.velocity.y = this.vector.y * 9;
            this.shield.setXY(this.x, this.y);

            if (this.zPos && this.shield.scale.x < this.MAX_SCALE) {
                this.shield.scale.setTo(this.shield.scale.x + this.SCALE_STEP);
            } else if (!this.zPos && this.shield.scale.x > this.MIN_SCALE) {
                this.shield.scale.setTo(this.shield.scale.x - this.SCALE_STEP);
            }
        }
    }
}