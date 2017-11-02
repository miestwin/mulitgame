import 'p2';
import 'pixi';
import 'phaser';

import { generatePoints, convexhull, randomNumberInRange } from '../utils';

export const shardColors = [0xffffff, 0xccccff, 0xccffff, 0xb3ffb3, 0xffff99, 0xffb3ff, 0x99ccff];

export function generateShards(game: Phaser.Game, count: number) {
    for (let i = 0; i < count; i++) {
        const points = convexhull(generatePoints(20, 20, 10));
        points.push(points[0]);
        const color = shardColors[randomNumberInRange(0, 6)];
        const graphics = game.add.graphics(0, 0);
        graphics.beginFill(color);
        graphics.moveTo(points[0][0], points[0][1]);
        for (let j = 1; j < points.length; j++) {
            const point = points[j];
            graphics.lineTo(point[0], point[1]);
        }
        graphics.endFill();
        game.cache.addImage('shard-' + i, null, graphics.generateTexture().baseTexture.source);
        graphics.destroy();
    }
}