import 'p2';
import 'pixi';
import 'phaser';
import { generateRandomSeed, noise, map } from '../utils';
declare var Perlin;

export function generateNebula(game: Phaser.Game, name: string) {
    const width = game.width;
    const height = game.height;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor = 'transparent';
    const ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    let data = generateTexture(canvas.width, canvas.height, imageData);
    ctx.putImageData(data, 0, 0);

    let img = new Image();
    img.onload = () => {
        game.cache.addImage(name, img.src, img);
    };
    img.src = canvas.toDataURL('image/png');
}

function generateTexture(
    width: number, 
    height: number,
    imageData: ImageData): ImageData {
    var pn = new Perlin(generateRandomSeed());
    let yoff = 0.0;
    for (let y = 0; y < height; y++) {
        let xoff = 0.0;
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            // const n = pn.noise(xoff, yoff, 0);
            // const bright = map_range(n, 0, 1, 0, 255);
            let bright = map(noise(yoff, xoff), 0, 1, 0, 255);
            bright = bright / 3;
            imageData.data[index * 4 + 0] = 179;
            imageData.data[index * 4 + 1] = 0;
            imageData.data[index * 4 + 2] = 179;
            imageData.data[index * 4 + 3] = bright;
            // imageData.data[index * 4 + 0] = bright;
            // imageData.data[index * 4 + 1] = bright;
            // imageData.data[index * 4 + 2] = bright;
            // imageData.data[index * 4 + 3] = 255;
            xoff += 0.01;
        }
        yoff += 0.01;
    }

    return imageData;
}