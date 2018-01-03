import { smoothNoise } from "./smoothNoise";

export function turbulence(
  noise: number[], //[][]
  x: number,
  y: number,
  size: number,
  noiseWidth: number,
  noiseHeight: number
) {
  let value = 0;
  const initialSize = size;
  while (size >= 1) {
    value +=
      smoothNoise(noise, x / size, y / size, noiseWidth, noiseHeight) * size;
    size /= 2;
  }

  return 128 * value / initialSize;
}
