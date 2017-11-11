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
    }

    private out() {
        this.destroy();
    }
}