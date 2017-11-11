import 'p2';
import 'pixi';
import 'phaser';

/**
 * Generacja gwiazd na scenie
 * @export
 * @param {Phaser.Game} game
 * @param {number} density 
 * @param {number} brightness 
 * @returns 
 */
export function stars(game:Phaser.Game, density: number, brightness: number, key: string) {
    const width = game.width;
    const height = game.height;
    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(canvas.width, canvas.height);
    let data = createData(canvas.width, canvas.height, density, brightness, Math.random, imageData);
    ctx.putImageData(data, 0, 0);

    let img = new Image();
    img.onload = () => {
        game.cache.addImage(key, img.src, img);
    };
    img.src = canvas.toDataURL('image/png');
}

/**
 * Generowanie gwiazd punktowych
 * @export
 * @param {number} width szerokość sceny
 * @param {number} height wysokość sceny
 * @param {number} density // [0, 1]
 * @param {number} brightness // wartość na bazie której wybierana będzie jasność każdej gwiazdy 
 * @param {Function} prng // generator liczb pseudolosowych
 */
function createData(width: number, height: number, density: number, brightness: number, prng: Function, imageData: ImageData): ImageData {
    // liczba gwiazd do wygenerowania
    const count = Math.round(width * height * density);

    for (let i = 0; i < count; i++) {
        // wybór piksela z jednolitym rozkładem
        const r = Math.floor(prng() * width * height);
        // losowe wybranie jasności z rozkładu wykładniczego
        let c = Math.round(255 * Math.log(1 - prng()) * -brightness);
        // kolor w skali szarości
        imageData.data[r * 4 + 0] = c;
        imageData.data[r * 4 + 1] = c;
        imageData.data[r * 4 + 2] = c;
        imageData.data[r * 4 + 3] = 255;
    }

    return imageData;
}