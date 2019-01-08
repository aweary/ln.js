import * as ln from "../src";

function shape(x: number, y: number): number {
  return -1 / Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), 2)
}

let scene = new ln.Scene();
let min = new ln.Vector(-2, -2, -4);
let max = new ln.Vector(2, 2, 2);
let box = new ln.Box(min, max);
let fn = new ln.Function(shape, box, ln.Direction.Below);
scene.add(fn);

let eye = new ln.Vector(3, 0, 3);
let center = new ln.Vector(1.1, 0, 0);
let up = new ln.Vector(0, 0, 1);
let width = window.innerWidth;
let height = window.innerHeight;
let paths = scene.render(eye, center, up, width, height, 50, 0.1, 100, 0.01);
document.body.innerHTML = ln.toSVG(paths, width, height);
