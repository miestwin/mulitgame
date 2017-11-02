
/**
 * Generowanie gwiazd punktowych
 * @export
 * @param {number} width szerokość sceny
 * @param {number} height wysokość sceny
 * @param {number} density // [0, 1]
 * @param {number} brightness // wartość na bazie której wybierana będzie jasność każdej gwiazdy 
 * @param {any} prng // generator liczb pseudolosowych
 */
export function generateTexture(width, height, density, brightness, prng) {
    // liczba gwiazd do wygenerowania
    const count = Math.round(width * height * density);
    // tablica bajtów przechowująca texturę szerokość x wysokość x ilość skłodowych na kolor czyli RGB
    // let data = new Uint8Array(width * height * 3);
    let data = new Uint8Array(width * height * 4);
    // let data = new ImageData(width, height);

    for (let i = 0; i < count; i++) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
    }

    for (let i = 0; i < count; i++) {
        // wybór piksela z jednolitym rozkładem
        const r = Math.floor(prng() * width * height);
        // losowe wybranie jasności z rozkładu wykładniczego
        let c = Math.round(255 * Math.log(1 - prng()) * -brightness);
        c = 255 - c;
        // kolor w skali szarości
        // data[r * 3 + 0] = c;
        // data[r * 3 + 1] = c;
        // data[r * 3 + 2] = c;
        data[r * 4 + 0] = c;
        data[r * 4 + 1] = c;
        data[r * 4 + 2] = c;
        data[r * 4 + 3] = 255;
    }

    return data;
}