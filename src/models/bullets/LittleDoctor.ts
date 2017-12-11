import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets'; 
import { IBullets } from './IBullets';

export class LittleDoctor extends Phaser.Group implements IBullets {
    
    /**
     * Czy możliwe jest oddanie następnego strału
     * @private
     * @type {number}
     * @memberof Bullets
     */
    private _nextFire: number = 0;

    /**
     * Czy możliwe jest oddanie następnego strału
     * @readonly
     * @type {number}
     * @memberof Bullets
     */
    public get nextFire(): number {
        return this._nextFire;
    }

    /**
     * Prędkość pojeyńczego pocisku
     * @type {number}
     * @memberof Bullets
     */
    public readonly bulletSpeed: number = 1500;

    /**
     * Częstotliwość strzałów
     * @type {number}
     * @memberof Bullets
     */
    public readonly fireRate: number = 2000;

    /**
     * Obrażenia zadawane przez pocisk
     * @type {number}
     * @memberof Bullets
     */
    public readonly damage: number = 500;
    
    constructor(game: Phaser.Game, key: string) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(100, key);
        this.setAll('anchor.x', 0);
        this.setAll('anchor.y', 0.5);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public shoot(sx: number, sy: number) {
        const bullet: Phaser.Sprite = this.getFirstExists(false);
        if (!bullet) {
            return;
        }
        if (this.game.time.now > this._nextFire) {
            bullet.reset(sx + 20, sy);
            bullet.body.velocity.x = this.bulletSpeed;
            this._nextFire = this.game.time.now + this.fireRate;
        }
    }
}