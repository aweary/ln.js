import * as ln from "../src";
import { request } from "http";

const scene = new ln.Scene();
const n = 5;
for (let x = -n; x <= n; x++) {
  for (let y = -n; y <= n; y++) {
    const p = Math.random() * 0.25 + 0.2;
    const dx = Math.random() * 0.5 - 0.25;
    const dy = Math.random() * 0.5 + 0.25;
    const z =3;
    const fx = x;
    const fy = y;
    const fz = Math.random() * 3 + 1;
    if (x === 2 && y === 1) {
      continue
    }
    const shape = new ln.Cube(
      new ln.Vector(fx - p, fy - p, 0),
      new ln.Vector(fx + p, fy + p, fz)
    );
    scene.add(shape);
  }
}

let eye = new ln.Vector(1.75, 1.25, 6);
let center = new ln.Vector(0, 0, 0);
let up = new ln.Vector(0, 0, 1);
let width = window.innerWidth;
let height = window.innerHeight;

function render() {
  let paths = scene.render(eye, center, up, width, height, 100, 0.1, 100, 0.01);
  let svg = ln.toSVG(paths, width, height);
  document.body.innerHTML = svg;
}

render();
