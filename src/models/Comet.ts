import 'p2';
import 'pixi';
import 'phaser';

import { rnd } from '../utils';

export class Comet extends Phaser.Sprite {

    public health = 10;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'comet-'+ rnd.integerInRange(1, 3));
        this.anchor.setTo(0, 0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.out, this);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.alive = false;
    }

    updated() {
        console.log('jestem tu');
        if (!this.alive) this.generate();
    }

    private out() {
        this.kill();
    }

    private generate() {
        console.log('losowanie', this.key);
        const chance = this.game.rnd.integerInRange(1, 100)
        if (chance != 1) {
            return;
        }
        this.reset(this.game.world.width, rnd.integerInRange(20, this.game.world.height - 20));
        this.body.velocity.x = rnd.integerInRange(-500, -600);
    }
}