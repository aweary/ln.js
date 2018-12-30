import * as ln from "../src";
import { request } from "http";

const scene = new ln.Scene();
const n = 1;
const p = 0.2;
for (let x = 0; x <= n; x++) {
  for (let y = 0; y <= n; y++) {
    const shape = new ln.Cube(
      new ln.Vector(x - p, y - p, 0),
      new ln.Vector(x + p, y + p, 2)
    );
    scene.add(shape);
  }
}

let eye = new ln.Vector(2, 2, 4);
let center = new ln.Vector(0, 0, 0);
let up = new ln.Vector(0, 0, 1);
let width = 1024.0;
let height = 1024.0;

function render() {
  let paths = scene.render(eye, center, up, width, height, 100, 0.1, 100, 0.01);
  let svg = ln.toSVG(paths, width, height);
  document.body.innerHTML = svg;
}

render();
