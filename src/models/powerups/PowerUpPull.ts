import 'p2';
import 'pixi';
import 'phaser';

import { Assets } from '../../assets';
import { Player } from '../Player';
import { Elements } from '../Elements';
import { IPowerUp } from './IPowerUp';

export class PowerUpPull extends Phaser.Sprite implements IPowerUp {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, Assets.Images.PowerUps.Pull.getName());
        this.anchor.setTo(0.5);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }

    powerup(player?: Player, options?: any) {
        const elements: Elements = options.points;
        const points = elements.countLiving();
        player.score += points;
        const fn: Function = options.fn;
        fn(player);
        elements.setAll('alive', false, true, true);
    }
}