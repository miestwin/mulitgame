import 'p2';
import 'pixi';
import 'phaser';

import { Const } from '../const';
import { rnd } from '../utils';

export class Comets extends Phaser.Group {
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(2, Const.Comet.Names);
        this.setAll('anchor.x', 0);
        this.setAll('anchor.y', 0.5);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public generate() {
        const comet: Phaser.Sprite = this.getFirstDead();
        const chance = rnd.integerInRange(1, 20);
        if (chance != 1 || !comet) {
            return;
        }
        comet.reset(this.game.world.width, rnd.integerInRange(20, this.game.world.height - 20), comet.height / 3);
        comet.body.velocity.x = rnd.integerInRange(-250, -350);
    }
}