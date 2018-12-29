import * as ln from "./src";

const scene = new ln.Scene();

function cube(min: [number, number, number], max: [number, number, number]) {
  const cube = new ln.Cube(new ln.Vector(...min), new ln.Vector(...max));
  scene.add(cube);
}

cube([0, 0, 0], [1, 1, 1]);
cube([-1, -1, -1], [-0.3, 1, 1]);

const eye = new ln.Vector(4, 3, 2);
const center = new ln.Vector(0, 0, 0);
const up = new ln.Vector(0, 0, 1);

const width = window.innerWidth;
const height = window.innerHeight;
let fovy = 50;
const znear = 0.1;
const zfar = 10;
const step = 0.01;

let paths = scene.render(
  eye,
  center,
  up,
  width,
  height,
  fovy,
  znear,
  zfar,
  step
);
document.body.innerHTML = ln.toSVG(paths, width, height);
