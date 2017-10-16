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
export function generateTexture (
width: number,
height: number,
density: number,
brightness: number, prng) {
    const count = Math.round(width * height * density);
    let data = new Uint8Array(width * height * 3);
    for (let i = 0; i < count; i++) {
        const r = Math.floor(prng() * width * height);
        const c = Math.round(255 * Math.log(1 - prng()) * -brightness);
        data[r * 3 + 0] = c;
        data[r * 3 + 1] = c;
        data[r * 3 + 2] = c;
    }
    return data;
}