export function cosineInterpolation(x: number, y: number, mu: number) {
  const mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
  return x * (1 - mu2) + y * mu2;
}
