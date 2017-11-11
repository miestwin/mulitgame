/**
 * Zmiana wartości całkowitej na heksadecymalną
 * @export
 * @param {any} n 
 * @returns 
 */
export function toHex(n: number) {
  let hex = n.toString(16);
  while (hex.length < 2) { hex = "0" + hex; }
  return hex;
}