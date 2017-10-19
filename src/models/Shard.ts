import 'p2';
import 'pixi';
import 'phaser';

import { generatePoints, convexhull } from '../utils';

export class Shard extends Phaser.Sprite {

    constructor(game: Phaser.Game, x: number, y: number) {
        const points = convexhull(generatePoints(x, y));
        points.push(points[0]);
        var graphics = game.add.graphics(0, 0);
        graphics.beginFill(0xffffff);
        graphics.lineStyle(6, 0xffffcc, 1);
        graphics.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            graphics.lineTo(point[0], point[1]);
        }
        graphics.endFill();
        super(game, x, y, graphics.generateTexture());
        graphics.destroy();
        this.anchor.setTo(0.5);
        game.add.existing(this);
        game.physics.arcade.enable(this);
        this.body.collideWorldBounds = true;
    }

    update() {
        
    }
}