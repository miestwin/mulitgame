export function getClouds(a: number) {
  const density = 0.5;
  const sharpness = 0.1;
  a = 1 - Math.pow(Math.E, -(a - density) * sharpness);
  a = a < 0 ? 0 : a;
  return a;
}
