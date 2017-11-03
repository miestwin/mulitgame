import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../utils';

export class Shard extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'powerup-' + randomNumberInRange(0, 2));
        this.anchor.setTo(0.5);
        game.add.tween(this).to(
            { angle: randomNumberInRange(0, 360) },
            randomNumberInRange(4000, 6000),
            Phaser.Easing.Sinusoidal.InOut,
            true, 0, -1, true);
    }
}