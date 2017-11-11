import 'p2';
import 'pixi';
import 'phaser';

import { Const } from '../const';

export function ship(game: Phaser.Game, key: string, color) {
    const graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x1f1f60);
    graphics.lineStyle(6, color, 1);
    graphics.moveTo(40,50);
    graphics.lineTo(100, 75);
    graphics.lineTo(40, 100);
    graphics.lineTo(60, 75);
    graphics.lineTo(40, 50);
    graphics.endFill();
    game.cache.addImage(key, null, graphics.generateTexture().baseTexture.source);
    graphics.destroy();
}