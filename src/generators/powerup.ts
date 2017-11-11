import 'p2';
import 'pixi';
import 'phaser';

import { generateRandomPoints, convexhull, Point } from '../utils';

import { Const } from '../const';

export function generatePowerUps(game: Phaser.Game) {
    Object.keys(Const.PowerUps).forEach((powerup => {
        const points = convexhull(generateRandomPoints(new Point(20, 20), 10));
        points.push(points[0]);
        const color = Const.PowerUps[powerup];
        const graphics = game.add.graphics(0, 0);
        graphics.beginFill(color);
        graphics.moveTo(points[0][0], points[0][1]);
        for (let j = 1; j < points.length; j++) {
            const point = points[j];
            graphics.lineTo(point[0], point[1]);
        }
        graphics.endFill();
        game.cache.addImage(powerup, null, graphics.generateTexture().baseTexture.source);
        graphics.destroy();
    }));
}