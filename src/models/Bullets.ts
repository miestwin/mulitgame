import 'p2';
import 'pixi';
import 'phaser';

export class Bullets extends Phaser.Group {
    
    /**
     * Czy możliwe jest oddanie następnego strału
     * @private
     * @memberof Bullets
     */
    private nextFire = 0;

    /**
     * Prędkość pojeyńczego pocisku
     * @private
     * @memberof Bullets
     */
    private bulletSpeed = 800;

    /**
     * Częstotliwość strzałów
     * @private
     * @memberof Bullets
     */
    private fireRate = 50;

    /**
     * Aktualna ramka bullet
     * @private
     * @memberof Bullets
     */
    private currentFrame = 0;
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(100, 'bullet', 0);
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
        if (this.game.time.now > this.nextFire) {
            this.currentFrame = (this.currentFrame + 1) % 80;
            bullet.reset(sx + 20, sy);
            bullet.frame = this.currentFrame;
            bullet.body.velocity.x = this.bulletSpeed;
            this.nextFire = this.game.time.now + this.fireRate;
        }
    }
}