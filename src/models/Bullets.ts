import 'p2';
import 'pixi';
import 'phaser';

export class Bullets extends Phaser.Group {
    private nextFire = 0;
    private bulletSpeed = 500;
    private fireRate = 350;
    
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
        const bullet = this.getFirstDead();
        if (!bullet) {
            return;
        }
        if (this.game.time.now > this.nextFire) {
            bullet.reset(sx, sy);
            bullet.body.velocity.x = this.bulletSpeed;
            this.nextFire = this.game.time.now + this.fireRate;
        }
    }
}