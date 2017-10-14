import 'p2';
import 'pixi';
import 'phaser';

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
    private score: number;

    constructor(game: Phaser.Game, x: number, y: number, { id, socketId, avatar }) {
        super(game, x, y, avatar);
        this._id = id;
        this._socketId = socketId;
        this.avatar = avatar;
        this.score = 0;
        this.anchor.setTo(0.5);
        this.scale.setTo(0.7);
        game.add.existing(this);
    }

    /**
     * Ustawia X i Y gracza
     * @param {number} x 
     * @param {number} y 
     * @memberof Player
     */
    public setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    init(game: Phaser.Game, x: number, y: number) {
        // game.physics.arcade.enable(this._sprite);
        // this._sprite.body.bounce.y = 0.2;
        // this._sprite.body.gravity.y = 300;
        // this._sprite.body.collideWorldBounds = true;
    }

    update() {

    }
}