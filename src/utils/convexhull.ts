import { Point } from './models';
import { cross } from './cross';

/**
 * Conveh hull
 * Monotone chain
 * @export
 * @param {Array<Point>} points 
 * @returns {Array<Point>} 
 */
export function convexhull(points: Array<Point>): Array<Point> {
    points.sort((a, b) => {
        return a.X == b.X ? a.Y - b.Y : a.X - b.X;
    });

    const lower = [];
    for (let i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        lower.push(points[i]);
    }

    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }
        upper.push(points[i]);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}