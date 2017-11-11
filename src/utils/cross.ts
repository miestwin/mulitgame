import { Point } from './models';

/**
 * Wskazówki zegara
 * @export
 * @param {number} a 
 * @param {number} b 
 * @param {number} o 
 * @returns {number} 
 */
export function cross(a: Point, b: Point, o: Point): number {
    return (a.X - o.X)  * (b.Y - o.Y) - (a.Y - o.Y) * (b.X - o.X);
}