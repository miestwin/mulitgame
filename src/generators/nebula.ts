import "p2";
import "pixi";
import "phaser";
import {
  noise,
  map,
  Color,
  toHex,
  generateNoise,
  smoothNoise,
  cosineInterpolation,
  turbulence,
  getClouds,
  minmax,
  noiseDetail
} from "../utils";

export function nebula(
  game: Phaser.Game,
  name: string,
  offset: number,
  color: Color,
  clouds?: boolean,
  density?: number,
  sharpness?: number
) {
  const width = game.width;
  const height = game.height;
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  canvas.style.backgroundColor = "transparent";
  const ctx = canvas.getContext("2d");
  let imageData = ctx.createImageData(canvas.width, canvas.height);
  let data = createData(
    canvas.width,
    canvas.height,
    offset,
    color,
    imageData,
    clouds,
    density,
    sharpness
  );
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
  imageData: ImageData,
  clouds?: boolean,
  density?: number,
  sharpness?: number
): ImageData {
  const temp = [];
  let yoff = offset;
  for (let y = 0; y < height; y++) {
    let xoff = offset;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const n = noise(yoff, xoff);
      // imageData.data[index * 4 + 0] = color.R;
      // imageData.data[index * 4 + 1] = color.G;
      // imageData.data[index * 4 + 2] = color.B;
      // arr[index * 4 + 3]
      const clouds = getClouds(
        n,
        density ? density : 0.5,
        sharpness ? sharpness : 0.1
      );
      temp.push(clouds);
      // const c = Color.rgbLum(color, map(n, 0, 1, 0, 0.5));
      // imageData.data[index * 4 + 0] = color.R;
      // imageData.data[index * 4 + 1] = color.G;
      // imageData.data[index * 4 + 2] = color.B;
      // const bright = clouds
      //   ? map(
      //       getClouds(n, density ? density : 0.5, sharpness ? sharpness : 0.1),
      //       0,
      //       0.05,
      //       0,
      //       255
      //     )
      //   : map(n, 0, 1, 0, 100);
      // imageData.data[index * 4 + 3] = bright;
      // xoff += 0.007;
      xoff = x < width / 2 ? xoff + 0.007 : xoff - 0.007;
    }
    yoff += 0.007;
  }

  const { min, max } = minmax(temp);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      imageData.data[index * 4 + 0] = color.R;
      imageData.data[index * 4 + 1] = color.G;
      imageData.data[index * 4 + 2] = color.B;
      imageData.data[index * 4 + 3] = map(
        temp[index],
        0,
        max > 0.05 ? max : 0.05,
        0,
        200
      );
    }
  }

  return imageData;
}

export function nebulaTest(game: Phaser.Game, name: string) {
  const arr = generateNoise(game.width, game.height);
  const width = game.width;
  const height = game.height;
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  canvas.style.backgroundColor = "transparent";
  const ctx = canvas.getContext("2d");
  let imageData = ctx.createImageData(canvas.width, canvas.height);
  let data = createData_TEST_2(canvas.width, canvas.height, imageData);
  ctx.putImageData(data, 0, 0);

  let img = new Image();
  img.onload = () => {
    game.cache.addImage(name, img.src, img);
  };
  img.src = canvas.toDataURL("image/png");
}

function createDataTest(
  width: number,
  height: number,
  imageData: ImageData
): ImageData {
  // const w = [0, 0, 0, 0, 0, 0.5];
  // for (let i = 4; i >= 0; i--) {
  //   w[i] = w[i + 1] / 2;
  // }
  noiseDetail(4, 0.5);
  const off = Math.random() * 32769;
  let yoff = off;
  for (let y = 0; y < height; y++) {
    let xoff = off;
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const n = noise(yoff, xoff);
      const brightness = map(n, 0, 1, 0, 255);
      imageData.data[index * 4 + 0] = brightness;
      imageData.data[index * 4 + 1] = brightness;
      imageData.data[index * 4 + 2] = brightness;
      imageData.data[index * 4 + 3] = 255;
      // const n = noise(arr[y][x], arr[y][x]);
      // let total = 0;
      // for (let i = 1; i < 7; i++) {
      //   const smooth = smoothNoise(
      //     arr,
      //     x / Math.pow(i, 2),
      //     y / Math.pow(i, 2),
      //     width,
      //     height
      //   );
      //   total += smooth * w[i - 1];
      // }
      // const iterp = cosineInterpolation(x / 64, y / 64, arr[y][x]);
      // let bright = map(arr[y][x], 0, 1, 0, 255);
      // const turb = turbulence(arr, x, y, 64, width, height);
      // let bright = map(turb, 0, 1, 0, 255);
      // let total = 0.0;
      // let frequency = 1 / width;
      // let amplitude = 0.5;
      // for (let i = 0; i < 6; i++) {
      //   total += noise(xoff * frequency, yoff * frequency) * amplitude;
      //   frequency *= 2;
      //   amplitude *= 0.5;
      // arr[y][x] = total;
      //}
      // total = map(total, 0, 1, 0, 50);
      // total = total < 0.5 ? 0 : 255;
      // const c = Color.rgbLum(color, map(total, 0, 1, 0, 0.5));
      // imageData.data[index * 4 + 0] = total < 0.5 ? 0 : color.R;
      // imageData.data[index * 4 + 1] = total < 0.5 ? 0 : color.G;
      // imageData.data[index * 4 + 2] = total < 0.5 ? 0 : color.B;
      // imageData.data[index * 4 + 3] =
      //   total < 0.5 ? 0 : map(total, 0, 1, 0, 255);
      xoff += 0.01;
    }
    yoff += 0.01;
  }

  return imageData;
}

function createData_TEST_2(
  width: number,
  height: number,
  imageData: ImageData
): ImageData {
  const temp = generateNoise(width, height);
  const arr = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      // const bright = map(temp[index], 0, 1, 0, 255);
      // const bright = map(
      //   smoothNoise(temp, x / 32, y / 32, width, height),
      //   0,
      //   1,
      //   0,
      //   255
      // );
      const n = turbulence(temp, x, y, 64, width, height);
      // const clouds = getClouds(n / 255, 0.4, 0.05);
      // const bright = clouds * 255; // map(clouds, 0, 1, 0, 255);
      const bright = n;
      imageData.data[index * 4 + 0] = bright;
      imageData.data[index * 4 + 1] = bright;
      imageData.data[index * 4 + 2] = bright;
      imageData.data[index * 4 + 3] = 255;
    }
  }

  return imageData;
}
