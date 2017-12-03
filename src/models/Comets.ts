import 'p2';
import 'pixi';
import 'phaser';

import { Const } from '../const';
import { rnd } from '../utils';

import { Comet } from './Comet';

export class Comets extends Phaser.Group {
    
    constructor(game: Phaser.Game) {
        super(game);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(3, Const.Comet.Names);
        Const.Comet.Names.forEach(name => {
            this.add(new Comet(game, game.width, rnd.integerInRange(20, game.height - 20), name));
        });
        this.setAll('anchor.x', 0);
        this.setAll('anchor.y', 0.5);
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
    }

    public generate() {
        const comet = this.getFirstDead();
        const chance = rnd.integerInRange(1, 100)
        if (chance != 1 || !comet) {
            return;
        }
        comet.reset(this.game.world.width, rnd.integerInRange(20, this.game.world.height - 20));
        comet.body.velocity.x = rnd.integerInRange(-500, -600);
    }
}