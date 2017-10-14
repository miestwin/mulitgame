import 'p2';
import 'pixi';
import 'phaser';

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

    get sockket() {
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

    constructor(game: Phaser.Game, x: number, y: number, { id, socketId, avatar }) {
        super(game, x, y, avatar);
        this._id = id;
        this._socketId = socketId;
        this.avatar = avatar;
        this.score = 0;
        this.vector = new Victor(0, 0);
        this.anchor.setTo(0.5);
        this.scale.setTo(0.7);
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
        this.body.velocity.x = this.vector.x * 6;
        this.body.velocity.y = this.vector.y * 6;
    }
}