import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';

export class PowerUpCooldown extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Images.PowerUps.Cooldown.getName());
        this.anchor.setTo(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    powerup(player?: Player, options?: any) {

    }
}