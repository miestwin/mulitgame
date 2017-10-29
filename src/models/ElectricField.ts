import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../utils';

export class ElectricField extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'electric-field', 0);
        this.anchor.setTo(0.5);
        this.scale.setTo(1.4);
        this.animations.add('electrify');
        this.animations.play('electrify', 15, true);
    }
}