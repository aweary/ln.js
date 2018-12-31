import * as ln from "../src";

const eye = new ln.Vector(8, 8, 8);
const center = new ln.Vector(0, 0, 0);
const up = new ln.Vector(0, 0, 1);
const scene = new ln.Scene();

for (let a = 0; a < 50; a++) {
  const n = 100;
  const xs = lowPassNoise(n, 0.3, 4);
  const ys = lowPassNoise(n, 0.3, 4);
  const zs = lowPassNoise(n, 0.3, 4);
  const ss = lowPassNoise(n, 0.3, 4);
  let position = new ln.Vector(0, 0, 0);
  for (let i = 0; i < n; i++) {
    const sphere = new ln.OutlineSphere(eye, up, position, 0.2);
    scene.add(sphere);
    const s = ((ss[i] + i) / 2) * 0.1 + 0.01;
    const v = new ln.Vector(xs[i], ys[i], zs[i]).normalize().multiplyScalar(s);
    position = position.add(v);
  }
}

const width = window.innerWidth;
const height = window.innerHeight;
const fovy = 50.0;
const paths = scene.render(
  eye,
  center,
  up,
  width,
  height,
  fovy,
  0.1,
  100,
  0.01
);
document.body.innerHTML = ln.toSVG(paths, width, height);

function lowPassNoise(n: number, alpha: number, iterations: number): number[] {
  let result: number[] = [];
  let i = 0;
  while (i++ < n) {
    result = lowPass(result, alpha);
  }

  for (let i = 0; i < iterations; i++) {
    result = lowPass(result, alpha);
  }
  result = normalize(result, -1, 1);
  return result;
}

function lowPass(values: number[], alpha: number): number[] {
  let result = [];
  let y: number = 0;
  for (let i = 0; i < values.length; i++) {
    let x = values[i];
    y = y - alpha * (y - x);
    result[i] = y;
  }
  return result;
}

function normalize(values: number[], a: number, b: number): number[] {
  let result = [];
  let lo = 0;
  let hi = 0;
  for (const x of values) {
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
  }
  for (let i = 0; i < values.length; i++) {
    let x = values[i];
    let p = (x - lo) / (hi - lo);
    result[i] = a + p * (b - a);
  }
  return result;
}
