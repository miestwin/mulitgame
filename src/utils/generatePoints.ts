import { randomNumberInRange } from './randomNumberInRange';

export function generatePoints(x: number, y: number, offset: number): number[] {
    const x1 = x - offset;
    const x2 = x + offset;
    const y1 = y - offset;
    const y2 = y + offset;
    const n = randomNumberInRange(5, 20);
    const points = [];
    for (let i = 0; i < 20; i++) {
        const _x = randomNumberInRange(x1, x2);
        const _y = randomNumberInRange(y1, y2);
        points.push([_x, _y]);
    }
    return points;
}