export function grad3d(i, x, y, z) {
  let h = i & 15;
  let u = h < 8 ? x : y,
    v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

export function grad2d(i, x, y) {
  let v = (i & 1) === 0 ? x : y;
  return (i & 2) === 0 ? -v : v;
}

export function grad1d(i, x) {
  return (i & 1) === 0 ? -x : x;
}
