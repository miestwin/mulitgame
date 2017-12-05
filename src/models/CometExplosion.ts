import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../assets';

export class CometExplosion extends Phaser.Group {
    
    constructor(game: Phaser.Game) {
        super(game);
        this.createMultiple(15, Assets.Spritesheets.Explosions.Comet.getName());
        this.forEach((explosion) => {
            explosion.anchor.setTo(0.5);
            explosion.scale.setTo(0.8);
            explosion.animations.add('explosion');
        }, this);
    }

    public generate(x: number, y: number) {
        const explosion: Phaser.Sprite = this.getFirstDead();
        if (!explosion) {
            return;
        }
        explosion.reset(x, y);
        explosion.play('explosion', 15, false, true);
    }
}