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
        this.zPos = false;
        this.vector = new Victor(0, 0);
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
        this.body.velocity.x = this.vector.x * 11;
        this.body.velocity.y = this.vector.y * 11;

        if (this.zPos && this.scale.x < 2) {
            this.scale.setTo(this.scale.x += 0.01);
        } else if (!this.zPos && this.scale.x > 1) {
            this.scale.setTo(this.scale.x -= 0.01);
        }
        // if (this.zPos && this.scale.x < 3) {
        //     if (this.downTween != null) {
        //         this.game.tweens.remove(this.downTween);
        //         this.downTween = null;
        //     }
        //     this.upTween =  this.game.add.tween(this.scale).to({ x: 3, y: 3}, 1000, Phaser.Easing.Back.InOut, true, 0, 1, false);
        // } else if (!this.zPos && this.scale.x > 1) {
        //     if (this.upTween != null) {
        //         this.game.tweens.remove(this.upTween);
        //         this.upTween = null;
        //     }
        //     this.downTween = this.game.add.tween(this.scale).to({ x: 1, y: 1}, 1000, Phaser.Easing.Back.InOut, true, 0, 1, false);
        // }
    }
}