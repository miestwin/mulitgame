/**
 * Klasa reprezentująca punkt
 * @export
 * @class Point
 */
export class Point {
  /**
     * Współrzędna X
     * @type {number}
     * @memberof Point
     */
  public X: number;

  /**
     * Współrzędna y
     * @type {number}
     * @memberof Point
     */
  public Y: number;

  constructor(x?: number, y?: number) {
    if (x) this.X = x;
    if (y) this.Y = y;
  }
}
