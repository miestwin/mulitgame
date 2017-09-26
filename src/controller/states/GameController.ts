import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

import Network from '../network';

export class GameController extends Phaser.State {

    private leftButton: Phaser.Sprite;
    private rightButton: Phaser.Sprite;
    private jumbButton: Phaser.Sprite;

    preload() {

    }

    create() {
        this.leftButton = this.game.add.sprite(
            this.game.world.centerX / 4 + 50,
            this.game.world.centerY,
            'left-shaded');
        this.leftButton.anchor.set(0.5);

        this.rightButton = this.game.add.sprite(
            (this.game.world.centerX / 4) * 3 + 50,
            this.game.world.centerY,
            'right-shaded');
        this.rightButton.anchor.set(0.5);

        this.jumbButton = this.game.add.sprite(
            this.game.world.centerX + this.game.world.centerX / 2,
            this.game.world.centerY,
            'x-shaded');
        this.jumbButton.anchor.set(0.5);
    }

    update() {

    }

    shutdown() {

    }
}