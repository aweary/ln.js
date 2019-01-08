import * as ln from "../src";
// create a scene and add a single cube
let scene = new ln.Scene();
let a = new ln.Sphere(new ln.Vector(1, 1, 1), 1);
let b = new ln.Sphere(new ln.Vector(3, 1, 1), 2);
let d = ln.BooleanShape.create(ln.CSGOperation.Difference, a, b);
// let r = ln.rotate(new ln.Vector(0, 0, 0), 1);
// let s = new ln.TransformedShape(c, r);
scene.add(d)

// scene.add(s)

// define camera parameters
let eye = new ln.Vector(4, 3, 2); // camera position
let center = new ln.Vector(0, 0, 0); // camera looks at
let up = new ln.Vector(0, 0, 1); // up direction

// define rendering parameters
let width = window.innerWidth; // rendered width
let height = window.innerHeight; // rendered height
let fovy = 50.0; // vertical field of view, degrees
let znear = 0.1; // near z plane
let zfar = 100.0; // far z plane
let step = 0.01; // how finely to chop the paths for visibility testing

function render() {
  eye.y -= 0.03;
  eye.x += 0.003;
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
  // save the paths as an svg
  document.body.innerHTML = ln.toSVG(
    paths,
    width,
    height
  )
  requestAnimationFrame(render)
}

render();
// compute 2D paths that depict the 3D scene
