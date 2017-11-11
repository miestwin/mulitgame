import 'p2';
import 'pixi';
import 'phaser';
import { noise, map, Color } from '../utils';

export function nebula(game: Phaser.Game, name: string, offset: number, color: Color) {
    const width = game.width;
    const height = game.height;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    canvas.style.backgroundColor = 'transparent';
    const ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    let data = createData(canvas.width, canvas.height, offset, color, imageData);
    ctx.putImageData(data, 0, 0);

    let img = new Image();
    img.onload = () => {
        game.cache.addImage(name, img.src, img);
    };
    img.src = canvas.toDataURL('image/png');
}

function createData(width: number, height: number, offset: number, color: Color, imageData: ImageData): ImageData {
    let yoff = offset;
    for (let y = 0; y < height; y++) {
        let xoff = offset;
        for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const n = noise(yoff, xoff);
            let bright = map(n, 0, 1, 0, 255);
            bright = bright / 5;
            imageData.data[index * 4 + 0] = color.R;
            imageData.data[index * 4 + 1] = color.G;
            imageData.data[index * 4 + 2] = color.B;
            imageData.data[index * 4 + 3] = bright;
            xoff += 0.01;
        }
        yoff += 0.01;
    }

    return imageData;
}