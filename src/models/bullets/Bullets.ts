import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets'; 
import { IBullets } from './IBullets';

export class Bullets extends Phaser.Group implements IBullets {
    
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
    public readonly bulletSpeed: number = 600;

    /**
     * Częstotliwość strzałów
     * @type {number}
     * @memberof Bullets
     */
    public readonly fireRate: number = 50;

    /**
     * Obrażenia zadawane przez pocisk
     * @type {number}
     * @memberof Bullets
     */
    public readonly damage: number = 2;
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(100, Assets.Images.Bulelts.ShmupBullet.getName());
        this.setAll('anchor.x', 0.5);
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