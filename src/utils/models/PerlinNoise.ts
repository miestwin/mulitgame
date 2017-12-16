import { lerp } from "../lerp";
import { grad1d, grad2d, grad3d } from "../grad";
import { Marsaglia } from "./Marsaglia";

const noiseProfile = { generator: null, octaves: 4, fallout: 0.5, seed: null };

export function noise(x: number, y?: number, z?: number) {
  if (noiseProfile.generator === null) {
    noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
  }
  var generator = noiseProfile.generator;
  var effect = 1,
    k = 1,
    sum = 0;
  for (let i = 0; i < noiseProfile.octaves; ++i) {
    effect *= noiseProfile.fallout;
    switch (arguments.length) {
      case 1:
        sum += effect * (1 + generator.noise1d(k * x)) / 2;
        break;
      case 2:
        sum += effect * (1 + generator.noise2d(k * x, k * y)) / 2;
        break;
      case 3:
        sum += effect * (1 + generator.noise3d(k * x, k * y, k * z)) / 2;
        break;
    }
    k *= 2;
  }
  return sum;
}

export function noiseDetail(octaves, fallout) {
  noiseProfile.octaves = octaves;
  if (fallout !== null) {
    noiseProfile.fallout = fallout;
  }
}

export function noiseSeed(seed) {
  noiseProfile.seed = seed;
  noiseProfile.generator = null;
}

export class PerlinNoise {
  private perm: Uint8Array;
  private rnd: Marsaglia;

  constructor(seed) {
    this.rnd =
      seed !== null
        ? new Marsaglia(seed, (seed << 16) + (seed >> 16))
        : Marsaglia.createRandomized();
    this.perm = new Uint8Array(512);
    let j;
    for (let i = 0; i < 256; ++i) {
      this.perm[i] = i;
    }
    for (let i = 0; i < 256; ++i) {
      const t = this.perm[(j = this.rnd.intGenerator() & 0xff)];
      this.perm[j] = this.perm[i];
      this.perm[i] = t;
    }
    for (let i = 0; i < 256; ++i) {
      this.perm[i + 256] = this.perm[i];
    }
  }

  noise3d(x, y, z) {
    let X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    let fx = (3 - 2 * x) * x * x,
      fy = (3 - 2 * y) * y * y,
      fz = (3 - 2 * z) * z * z;
    var p0 = this.perm[X] + Y,
      p00 = this.perm[p0] + Z,
      p01 = this.perm[p0 + 1] + Z,
      p1 = this.perm[X + 1] + Y,
      p10 = this.perm[p1] + Z,
      p11 = this.perm[p1 + 1] + Z;
    return lerp(
      fz,
      lerp(
        fy,
        lerp(
          fx,
          grad3d(this.perm[p00], x, y, z),
          grad3d(this.perm[p10], x - 1, y, z)
        ),
        lerp(
          fx,
          grad3d(this.perm[p01], x, y - 1, z),
          grad3d(this.perm[p11], x - 1, y - 1, z)
        )
      ),
      lerp(
        fy,
        lerp(
          fx,
          grad3d(this.perm[p00 + 1], x, y, z - 1),
          grad3d(this.perm[p10 + 1], x - 1, y, z - 1)
        ),
        lerp(
          fx,
          grad3d(this.perm[p01 + 1], x, y - 1, z - 1),
          grad3d(this.perm[p11 + 1], x - 1, y - 1, z - 1)
        )
      )
    );
  }

  noise2d(x, y) {
    var X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    var fx = (3 - 2 * x) * x * x,
      fy = (3 - 2 * y) * y * y;
    var p0 = this.perm[X] + Y,
      p1 = this.perm[X + 1] + Y;
    return lerp(
      fy,
      lerp(fx, grad2d(this.perm[p0], x, y), grad2d(this.perm[p1], x - 1, y)),
      lerp(
        fx,
        grad2d(this.perm[p0 + 1], x, y - 1),
        grad2d(this.perm[p1 + 1], x - 1, y - 1)
      )
    );
  }

  noise1d(x) {
    var X = Math.floor(x) & 255;
    x -= Math.floor(x);
    var fx = (3 - 2 * x) * x * x;
    return lerp(fx, grad1d(this.perm[X], x), grad1d(this.perm[X + 1], x - 1));
  }
}
