import { Color } from '../models';

export function colorLuminance(hex: string, lum: number = 0) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    // convert to decimal and change luminosity
    let rgb = '#';
    let c;
    for (let i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
    }
    return rgb;
}

export function rgbLum(color: Color, lum: number) {
    const rgb = [color.R, color.G, color.B];
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.round(Math.min(Math.max(0, rgb[i] + (rgb[i] * lum)), 255)); // rgb lum
    }
    color.R = rgb[0];
    color.G = rgb[1];
    color.B = rgb[2]
    return color;
}