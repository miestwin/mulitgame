import 'p2';
import 'pixi';
import 'phaser';

import { generateRandomPoints, convexhull, Point } from '../utils';

export function element(game: Phaser.Game, key: string, color) {
    const points = convexhull(generateRandomPoints(new Point(10, 10), 5, 20));
    points.push(points[0]);
    const graphics = game.add.graphics(0, 0);
    graphics.beginFill(color);
    graphics.moveTo(points[0].X, points[0].Y);
    for (let j = 1; j < points.length; j++) {
        const point = points[j];
        graphics.lineTo(point.X, point.Y);
    }
    graphics.endFill();
    game.cache.addImage(key, null, graphics.generateTexture().baseTexture.source);
    graphics.destroy();
}