import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../utils';

export class Meteor extends Phaser.Sprite {

    public health = 30;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'meteor-' + randomNumberInRange(1, 6));
        this.anchor.setTo(0.5);
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(this.out, this);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
    }

    private out() {
        this.kill();
    }
}