import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets'; 
import { IBullets } from './IBullets';

export class MultipleBullets extends Phaser.Group implements IBullets {
    
    /**
     * Czy możliwe jest oddanie następnego strału
     * @private
     * @memberof MultipleBullets
     */
    private _nextFire = 0;

    public get nextFire(): number {
        return this._nextFire;
    }

    /**
     * Prędkość pojeyńczego pocisku
     * @private
     * @memberof MultipleBullets
     */
    public readonly bulletSpeed = 800;

    /**
     * Częstotliwość strzałów
     * @private
     * @memberof MultipleBullets
     */
    public readonly fireRate = 50;

    /**
     * Obrażenia zadawane przez pocisk
     * @type {number}
     * @memberof MultipleBullets
     */
    public readonly damage: number = 5;
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(100, Assets.Images.Bulelts.Bullet.getName());
        this.setAll('anchor.x', 0.5);
        this.setAll('anchor.y', 0.5);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public shoot(sx: number, sy: number) {
        const bullet: Phaser.Sprite = this.getFirstDead();
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