import 'p2';
import 'pixi';
import 'phaser';
import { generateRandomSeed, noise, map, randomNumberInRange, colorLuminance, toHex, rgbLum } from '../utils';
import { Color } from '../models';

const colors = [
    { r: 179, g: 0, b: 179 },
    { r: 225, g: 51, b: 0 },
    { r: 0, g: 153, b: 51 }
];

export function generateNebula(game: Phaser.Game, name: string, offset: number, color: Color) {
    const width = game.width;
    const height = game.height;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor = 'transparent';
    const ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    let data = generateTexture(canvas.width, canvas.height, offset, color, imageData);
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
    offset: number,
    color: Color,
    imageData: ImageData): ImageData {
    let yoff = offset;
    for (let y = 0; y < height; y++) {
        let xoff = offset;
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const n = noise(yoff, xoff);
            //const c = colorLuminance('#' + toHex(color.R) + toHex(color.G) + toHex(color.B), n);
            const c = rgbLum(color, n);
            let bright = map(n, 0, 1, 0, 255);
            bright = bright / 5;
            imageData.data[index * 4 + 0] = c.R;
            imageData.data[index * 4 + 1] = c.G;
            imageData.data[index * 4 + 2] = c.B;
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