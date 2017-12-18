import { map } from "./map";

export function generateNoise(width: number, height: number) {
  let noise = [];
  for (let y = 0; y < height; y++) {
    noise.push([]);
    for (let x = 0; x < width; x++) {
      noise[y][x] = map(Math.random() * 32769, 0, 32768, 0, 1);
    }
  }
  return noise;
}
