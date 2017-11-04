import 'p2';
import 'pixi';
import 'phaser';

import { generatePoints, convexhull, randomNumberInRange } from '../utils';

export const powerUps = {
    'power-up_cooldown': 0xffffff, 
    'power-up_pull': 0xccccff,
    'power-up_big': 0xccffff,
    // 'power-up_': 0xb3ffb3,
    // 'power-up_': 0xffff99,
    // 'power-up_': 0xffb3ff,
    // 'power-up_': 0x99ccff
};

export function generatePowerUps(game: Phaser.Game) {
    Object.keys(powerUps).forEach((powerup => {
        const points = convexhull(generatePoints(20, 20, 10));
        points.push(points[0]);
        const color = powerUps[powerup];
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