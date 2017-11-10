export function toHex(n) {
  var hex = n.toString(16);
  while (hex.length < 2) {hex = "0" + hex; }
  return hex;
}