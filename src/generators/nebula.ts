import "p2";
import "pixi";
import "phaser";
import { noise, map, Color, toHex } from "../utils";

export function nebula(
  game: Phaser.Game,
  name: string,
  offset: number,
  color: Color
) {
  const width = game.width;
  const height = game.height;
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  canvas.style.backgroundColor = "transparent";
  const ctx = canvas.getContext("2d");
  let imageData = ctx.createImageData(canvas.width, canvas.height);
  let data = createData(canvas.width, canvas.height, offset, color, imageData);
  ctx.putImageData(data, 0, 0);

  let img = new Image();
  img.onload = () => {
    game.cache.addImage(name, img.src, img);
  };
  img.src = canvas.toDataURL("image/png");
}

function createData(
  width: number,
  height: number,
  offset: number,
  color: Color,
  imageData: ImageData
): ImageData {
  let yoff = offset;
  let toff = 0;
  for (let y = 0; y < height; y++) {
    let xoff = offset;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const n = noise(yoff, xoff);
      const c = Color.rgbLum(color, map(n, 0, 1, 0, 0.5));
      let bright = map(n, 0, 1, 0, 150);
      // bright = bright / 3;
      imageData.data[index * 4 + 0] = c.R;
      imageData.data[index * 4 + 1] = c.G;
      imageData.data[index * 4 + 2] = c.B;
      imageData.data[index * 4 + 3] = bright;
      xoff = x < width / 2 ? xoff + 0.007 : xoff - 0.007;
    }
    yoff += 0.007;
  }

  return imageData;
}
