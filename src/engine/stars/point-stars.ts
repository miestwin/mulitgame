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
//     const width = 100;
//     const height = 100;
//     const data = starsData.generateTexture(width, height, density, brightness, Math.random);

    // const c = document.createElement('canvas');
    // c.width = width;
    // c.height = height;
    // const ctx = c.getContext('2d');
    // ctx.putImageData(data, 0, 0);

    // var base64Data = btoa(String.fromCharCode.apply(null, data));
    // var image = document.createElement('img');
    // image.onload = () => {
    //     game.cache.addImage('starfield', image.src, image);
    // };
    // image.src = 'data:image/png;base64,' + base64Data;

    // let img = new Image();
    // img.onload = () => { 
    //     console.log(dataURI);
    //     game.cache.addImage('starfield', img.src, img);
    // };
    // img.src = dataURI;
    // img.src = c.toDataURL('image/png');
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