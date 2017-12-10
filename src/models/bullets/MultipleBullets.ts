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
    public readonly fireRate = 150;

    /**
     * Obrażenia zadawane przez pocisk
     * @type {number}
     * @memberof MultipleBullets
     */
    public readonly damage: number = 2;
    
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
        if (this.game.time.now > this._nextFire) {
            const bullet_1: Phaser.Sprite = this.getFirstExists(false);
            bullet_1.reset(sx + 25, sy);
            bullet_1.body.velocity.x = this.bulletSpeed;
            bullet_1.body.gravity.y = -200;
            const bullet_2: Phaser.Sprite = this.getFirstExists(false);
            bullet_2.reset(sx + 25, sy);
            bullet_2.body.velocity.x = this.bulletSpeed;
            bullet_2.body.gravity.y = 0;
            const bullet_3: Phaser.Sprite = this.getFirstExists(false);
            bullet_3.reset(sx + 25, sy);
            bullet_3.body.velocity.x = this.bulletSpeed;
            bullet_3.body.gravity.y = 200;
            this._nextFire = this.game.time.now + this.fireRate;    
        }
    }
}