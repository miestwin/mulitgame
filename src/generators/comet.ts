import "p2";
import "pixi";
import "phaser";

import { generateRandomPoints, convexhull, Point } from "../utils";

export function comet(
  game: Phaser.Game,
  width: number,
  height: number,
  rc: number,
  key: string
) {
  const x = height / 2;
  const y = height / 2;
  const rt = height / 2;
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  const ctx = canvas.getContext("2d");

  var grd = ctx.createLinearGradient(0, 0, width, 0);
  grd.addColorStop(0, "rgba(255, 255, 255, 1)");
  grd.addColorStop(1, "rgba(255, 255, 255, 0.5)");
  ctx.fillStyle = grd;
  ctx.arc(x, y, rt, 90, Math.PI, true);
  ctx.moveTo(x, height);
  ctx.lineTo(width, height);
  ctx.lineTo(width, 0);
  ctx.lineTo(x, 0);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#802b00";
  const points = convexhull(generateRandomPoints(new Point(x, y), rc, 50));
  points.push(points[0]);
  ctx.moveTo(points[0].X, points[0].Y);
  for (let j = 1; j < points.length; j++) {
    const point = points[j];
    ctx.lineTo(point.X, point.Y);
  }
  ctx.fill();

  let img = new Image();
  img.onload = () => {
    game.cache.addImage(key, img.src, img);
  };
  img.src = canvas.toDataURL("image/png");
}
