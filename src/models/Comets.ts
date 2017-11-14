import 'p2';
import 'pixi';
import 'phaser';

import { Const } from '../const';

export class Comets extends Phaser.Group {
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(3, Const.Comet.Names);
        this.setAll('anchor.x', 0);
        this.setAll('anchor.y', 0.5);
        this.setAll('health', 10);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public generate() {
        const comet = this.getFirstDead();
        const chance = this.game.rnd.integerInRange(1, 100)
        if (chance != 1 || !comet) {
            return;
        }
        comet.reset(this.game.world.width, this.game.rnd.integerInRange(20, this.game.world.height - 20));
        comet.body.velocity.x = this.game.rnd.integerInRange(-500, -600);
    }
}