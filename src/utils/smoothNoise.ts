export function smoothNoise(
  noise: number[],
  x: number,
  y: number,
  noiseWidth: number,
  noiseHeight: number
) {
  // get fractional part of x and y
  const fractX = x - Math.floor(x);
  const fractY = y - Math.floor(y);

  // wrap around
  const x1 = (Math.floor(x) + noiseWidth) % noiseWidth;
  const y1 = (Math.floor(y) + noiseHeight) % noiseHeight;

  // neighbor values
  const x2 = (x1 + noiseWidth - 1) % noiseWidth;
  const y2 = (y1 + noiseHeight - 1) % noiseHeight;

  // smooth the noise with bilinear interpolation
  let value = 0;
  // value += fractX * fractY * noise[y1][x1];
  // value += (1 - fractX) * fractY * noise[y1][x2];
  // value += fractX * (1 - fractY) * noise[y2][x1];
  // value += (1 - fractX) * (1 - fractY) * noise[y2][x2];

  value += fractX * fractY * noise[y1 * noiseWidth + x1];
  value += (1 - fractX) * fractY * noise[y1 * noiseWidth + x2];
  value += fractX * (1 - fractY) * noise[y2 * noiseWidth + x1];
  value += (1 - fractX) * (1 - fractY) * noise[y2 * noiseWidth + x2];

  return value;
}
