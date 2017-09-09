import 'p2';
import 'pixi';
import 'phaser';

import { States } from './States';

export class Message extends Phaser.State {
    private message: string;

    init(message: string) {
        this.message = message;
    }

    preload() {}

    create() {
        var message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.message, { font: '35px Kenvector Future', fill: '#ffffff', align: 'center' });
        message.anchor.set(0.5);
    }
}