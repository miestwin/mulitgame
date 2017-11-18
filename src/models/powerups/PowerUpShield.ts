import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';

export class PowerUpShield extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Images.PowerUps.Shield.getName());
        this.anchor.setTo(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    powerup(player?: Player, options?: any) {
        player.MAX_SCALE = 3;
        player.SCALE_STEP = 0.2;
        setTimeout(() => {
            player.MAX_SCALE = 1.6;
            player.SCALE_STEP = 0.02;
        }, 4000);
    }
}