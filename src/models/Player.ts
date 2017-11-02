import 'p2';
import 'pixi';
import 'phaser';

import { Shield } from './Shield';

declare var Victor;

export class Player extends Phaser.Sprite {

    public static get MAX_SCALE() {
        return 1.6;
    }

    public static get MIN_SCALE() {
        return 0;
    }

    public static get DEFAULT_SCALE() {
        return 1;
    }

    public static get SCALE_STEP() {
        return 0.02;
    }

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
     * Nazwa używanego avatara
     * @private
     * @type {string}
     * @memberof Player
     */
    private avatar: string;

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

    constructor(game: Phaser.Game, x: number, y: number, { id, socketId, avatar }) {
        super(game, x, y, avatar);
        this._id = id;
        this._socketId = socketId;
        this.avatar = avatar;
        this.score = 0;
        this.zPos = false;
        this.vector = new Victor(0, 0);
        this.angle = 0;
        this.anchor.setTo(0.5);
        this.scale.setTo(1);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
        this.shield = new Shield(game, x, y, this._id);
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

            if (this.zPos && this.shield.scale.x < Player.MAX_SCALE) {
                this.shield.scale.setTo(this.shield.scale.x + Player.SCALE_STEP);
            } else if (!this.zPos && this.shield.scale.x > Player.MIN_SCALE) {
                this.shield.scale.setTo(this.shield.scale.x - Player.SCALE_STEP);
            }
        }
    }
}