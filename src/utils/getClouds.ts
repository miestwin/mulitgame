export function getClouds(a: number, density: number, sharpness: number) {
  // const density = 0.4;
  // const sharpness = 0.05;
  a = 1 - Math.pow(Math.E, -(a - density) * sharpness);
  a = a < 0 ? 0 : a;
  return a;
}
