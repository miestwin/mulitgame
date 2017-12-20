export function minmax(arr: number[]) {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  const minmax = arr.reduce(
    (prev, next) => {
      prev.min = min > next ? next : min;
      prev.max = max < next ? next : max;
      return prev;
    },
    { min, max }
  );
  return minmax;
}
