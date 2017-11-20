import 'p2';
import 'pixi';
import 'phaser';

import { Const } from '../const';
import { rnd } from '../utils';

export class Elements extends Phaser.Group {
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(10, Const.Element.Names);
        this.setAll('anchor.x', 0.5);
        this.setAll('anchor.y', 0.5);
        this.setAll('scale.x', 1.5);
        this.setAll('scale.y', 1.5);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public generate() {
        const element = this.getFirstDead();
        const chance = rnd.integerInRange(1, 5);
        if (chance != 1 || !element) {
            return;
        }
        element.reset(this.game.world.width, rnd.integerInRange(20, this.game.world.height - 20));
        element.body.velocity.x = rnd.integerInRange(-600, -700);
    }
}