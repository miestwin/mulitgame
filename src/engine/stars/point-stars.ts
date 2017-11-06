import 'p2';
import 'pixi';
import 'phaser';

import { randomNumberInRange } from '../../utils';
import * as starsData from './stars-data';

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
export function pointStars_TEST (game:Phaser.Game, density: number, brightness: number) {
    const width = game.width / 2;
    const height = game.height / 2;
    var canvas = <HTMLCanvasElement>document.getElementById('textureGenerator');
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    const data = starsData.generateTexture(width, height, density, brightness, Math.random);
    
     for (let y = 0; y < height; y++) {
         for (let x = 0; x < width; x++) {
            const index = y * width + x;
            ctx.fillStyle = `rgba(${data[index*4+0]},${data[index*4+1]},${data[index*4+2]},${data[index*4+1]/255})`;
            ctx.fillRect(x, y, 1, 1);
         }
     }

    let img = new Image();
    img.onload = () => {
        game.cache.addImage('starfield', img.src, img);
        ctx.clearRect(0, 0, width, height);
    };
    img.src = canvas.toDataURL('image/png');
}


export function pointStars (game:Phaser.Game, density: number, distance: number) {
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