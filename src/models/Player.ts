import 'p2';
import 'pixi';
import 'phaser';

declare var Victor;

var ships = {
    'player-ship_green': 0x33cc33,
    'player-ship_purple': 0x9933ff,
    'player-ship_blue': 0x0066ff,
    'player-ship_yellow': 0xffff00,
    'player-ship_pink': 0xff3399,
    'player-ship_red': 0xff0000,
    'player-ship_gb': 0x009999,
    'player-ship_orange': 0xff6600,
    'player-ship_grass': 0x88cc00,
    'player-ship_darkpink': 0x993333
};

export class Player extends Phaser.Sprite {

    public static get MAX_SCALE() {
        return 1.6;
    }

    public static get MIN_SCALE() {
        return 0.4;
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
    public zPos: number; 

    private upTween: Phaser.Tween;
    private downTween: Phaser.Tween;

    constructor(game: Phaser.Game, x: number, y: number, { id, socketId, avatar }) {
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x1f1f60);
        graphics.lineStyle(6, ships[avatar], 1);
        graphics.moveTo(40,50);
        graphics.lineTo(100, 75);
        graphics.lineTo(40, 100);
        graphics.lineTo(60, 75);
        graphics.lineTo(40, 50);
        graphics.endFill();
        super(game, x, y, graphics.generateTexture());
        graphics.destroy();
        this._id = id;
        this._socketId = socketId;
        this.avatar = avatar;
        this.score = 0;
        this.zPos = 0;
        this.vector = new Victor(0, 0);
        this.angle = 0;
        this.anchor.setTo(0.5);
        this.scale.setTo(1);
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
            this.body.velocity.x = this.vector.x * 11;
            this.body.velocity.y = this.vector.y * 11;

            if ((this.zPos === 1) && (this.scale.x < Player.MAX_SCALE)) {
                this.scale.setTo(this.scale.x += Player.SCALE_STEP);
            } else if ((this.zPos === -1) && (this.scale.x > Player.MIN_SCALE)) {
                this.scale.setTo(this.scale.x -= Player.SCALE_STEP);
            } else if ((this.zPos === 0) && (this.scale.x > Player.DEFAULT_SCALE)) {
                this.scale.setTo(this.scale.x -= Player.SCALE_STEP);
            } else if ((this.zPos === 0) && (this.scale.x < Player.DEFAULT_SCALE)) {
                this.scale.setTo(this.scale.x += Player.SCALE_STEP);
            }
        }
    }
}