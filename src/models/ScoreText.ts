import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../assets';

export class ScoreText extends Phaser.Text {
    private moveUpTween:  Phaser.Tween;
    private fadeOutTween: Phaser.Tween;

    constructor(game: Phaser.Game, x: number, y: number, key: string, color: string) {
        super(game, x, y, key, { 
            font: `20px ${Assets.Fonts.Kenvector.getFamily()}`,
            fill: color,
            align: 'center'
        });
        this.anchor.set(0.5);
        game.add.existing(this);
        this.moveUpTween = game.add.tween(this).to({ y: y - 50}, 1500, Phaser.Easing.Linear.None, true);
        this.fadeOutTween = game.add.tween(this).to({ alpha: 0 }, 1500, Phaser.Easing.Linear.None, true);
        this.fadeOutTween.onComplete.add(() => {
            this.game.tweens.remove(this.moveUpTween);
            this.game.tweens.remove(this.fadeOutTween);
            this.destroy();
        }, this);
    }
}