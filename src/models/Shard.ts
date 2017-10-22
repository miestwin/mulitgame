import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../utils';

export class Shard extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'shard');
        this.anchor.setTo(0.5);
        this.scale.setTo(0.1);
        this.angle += randomNumberInRange(0, 360);
        // game.add.existing(this);
        // game.physics.arcade.enable(this);
        // this.body.collideWorldBounds = true;
    }
}