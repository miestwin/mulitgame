import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../../utils';

/**
 * Generacja gwiazd na scenie
 * @export
 * @param {number} width 
 * @param {number} height 
 * @param {number} density 
 * @param {number} brightness 
 * @param {any} prng 
 * @returns 
 */
export function generatePointStars (game:Phaser.Game, density: number, distance: number) {
    const width = game.world.width;
    const height = game.world.height;
    const count = Math.round(width * height * density);
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xffffff);
    for (let i = 1; i < count; i++) {
        const x = randomNumberInRange(width, height);
        const y = randomNumberInRange(width, height);
        graphics.drawCircle(x, y, distance);
    }
    graphics.endFill();
    return graphics.generateTexture();
}