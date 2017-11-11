/**
 * Klasa reprezentująca kolor
 * @export
 * @class Color
 */
export class Color {
    public R: number;
    public G: number;
    public B: number;
    public A: number;

    constructor(r: number, g: number, b: number, a?: number) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a ? a : 255;
    }

    /**
     * Utwożenie nowego koloru
     * @static
     * @param {number} r 
     * @param {number} g 
     * @param {number} b 
     * @param {number} [a] 
     * @returns 
     * @memberof Color
     */
    public static fromRGBA(r: number, g: number, b: number, a?: number) {
        return new Color(r, g, b, a != null ? a : 255);
    }

    /**
     * Zmiana rozjaśnienia koloru
     * @static
     * @param {Color} color 
     * @param {number} lum 
     * @returns 
     * @memberof Color
     */
    public static rgbLum(color: Color, lum: number) {
        return new Color(
            Math.round(Math.min(Math.max(0, color.R + (color.R * lum)), 255)),
            Math.round(Math.min(Math.max(0, color.G + (color.G * lum)), 255)),
            Math.round(Math.min(Math.max(0, color.B + (color.B * lum)), 255))
        );
    }
}