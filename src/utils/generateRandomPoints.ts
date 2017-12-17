import { rnd } from "./rnd";
import { Point } from "./models";

/**
 * Tworzy tablicę losowych punktów
 * @export
 * @param {Point} point 
 * @param {number} offset 
 * @returns {Array<Point>} 
 */
export function generateRandomPoints(
  point: Point,
  offset: number,
  count: number
): Array<Point> {
  const x1 = point.X - offset;
  const x2 = point.X + offset;
  const y1 = point.Y - offset;
  const y2 = point.Y + offset;
  const points = [];
  for (let i = 0; i < count; i++) {
    const _x = rnd.integerInRange(x1, x2);
    const _y = rnd.integerInRange(y1, y2);
    points.push(new Point(_x, _y));
  }
  return points;
}
