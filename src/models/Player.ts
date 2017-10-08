import 'phaser';

export class Player {

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
     * Nazwa używanej postać
     * @private
     * @type {string}
     * @memberof Player
     */
    private character: string;

    /**
     * Wynik
     * @private
     * @type {number}
     * @memberof Player
     */
    private score: number;

    /**
     * Pozycja gracza na mapie gry
     * @private
     * @type {Object}
     * @memberof Player
     */
    private position: Object;

    /**
     * Awatar
     * @private
     * @type {Phaser.Sprite}
     * @memberof Player
     */
    private _sprite: Phaser.Sprite;

    get sprite() {
        return this._sprite;
    }

    constructor(player) {
        this._id = player.id;
        this._socketId = player.socketId;
        this.character = player.character;
        this.score = 0;
        this.position = {};
    }


    /**
     * Inicjalizacja awatara gracza
     * @param {Phaser.Game} game 
     * @param {number} x 
     * @param {number} y 
     * @memberof Player
     */
    init(game: Phaser.Game, x: number, y: number) {
        this._sprite = game.add.sprite(x, y, this.character + '-run');
        this._sprite.anchor.set(0.5, 1);
        this._sprite.scale.set(0.18);
        //
        game.physics.arcade.enable(this._sprite);
        this._sprite.body.bounce.y = 0.2;
        this._sprite.body.gravity.y = 300;
        this._sprite.body.collideWorldBounds = true;
        
        this._sprite.animations.add('run');
    }

    showCharacter(game: Phaser.Game, x: number, y: number) {
        this._sprite = game.add.sprite(x, y, this.character + '-idle');
        this._sprite.anchor.set(0.5, 1);
        this._sprite.scale.set(0.18);
        this._sprite.animations.add('idle');
    }

    update() {

    }

    /**
     * Ustawia X
     * @param {number} value 
     * @memberof Player
     */
    setX(value: number) {
        if (this._sprite != null) {
            this._sprite.x = value;
        }
    }

    /**
     * Ustawia Y
     * @param {number} value 
     * @memberof Player
     */
    setY(value: number) {
        if (this._sprite != null) {
            this._sprite.y = value;
        }
    }

    /**
     * Uruchamia animację idle
     * @memberof Player
     */
    idle() {
        this._sprite.animations.play('idle', 15, true);
    }

    run() {
        this._sprite.animations.play('run', 30, true);
    }

    /**
     * Usunięcie sprite
     * @memberof Player
     */
    destroy() {
        this._sprite.destroy();
    }
}