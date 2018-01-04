import { map } from "./map";

export function generateNoise(width: number, height: number) {
  const noise = [];
  for (let y = 0; y < height; y++) {
    // noise.push([]);
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      noise[index] = Math.random() * 32769 / 32768;
      // noise[index] = map(Math.random() * 32769, 0, 32768, 0, 1);
      // noise[y][x] = map(Math.random() * 32769, 0, 32768, 0, 1);
    }
  }
  return noise;
}
