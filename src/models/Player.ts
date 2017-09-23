import 'phaser';

export class Player {

    /**
     * Identyfikator
     * @private
     * @type {string}
     * @memberof Player
     */
    private id: string;

    /**
     * Identyfikator socket
     * @private
     * @type {string}
     * @memberof Player
     */
    private socketId: string;

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
    private sprite: Phaser.Sprite;

    constructor(player) {
        this.id = player.id;
        this.socketId = player.socketId;
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
        this.sprite = game.add.sprite(x, y, this.character + '-idle');
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(0.18);
        this.sprite.animations.add('idle');
    }

    update() {

    }

    /**
     * Ustawia X
     * @param {number} value 
     * @memberof Player
     */
    setX(value: number) {
        if (this.sprite != null) {
            this.sprite.x = value;
        }
    }

    /**
     * Ustawia Y
     * @param {number} value 
     * @memberof Player
     */
    setY(value: number) {
        if (this.sprite != null) {
            this.sprite.y = value;
        }
    }

    /**
     * Uruchamia animację idle
     * @memberof Player
     */
    idle() {
        this.sprite.animations.play('idle', 15, true);
    }
}