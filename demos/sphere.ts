import * as ln from "../src";
// create a scene and add a single cube
let scene = new ln.Scene();
scene.add(new ln.Sphere(new ln.Vector(-1, -1, -1), 1));
scene.add(new ln.Sphere(new ln.Vector(1, 1, -0.3), 0.5));

let c = new ln.Cube(new ln.Vector(-0.1, -0.2, -.5), new ln.Vector(0.5, 0.5, 0.5));
let r = ln.rotate(new ln.Vector(0.5, 0, 0), Math.PI / 4);
let s = new ln.TransformedShape(c, r);
scene.add(s)



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
  console.log(paths);
  // save the paths as an svg
  document.body.innerHTML = `<div style="border: 1px solid red">${ln.toSVG(paths, width, height)}</div>`;
  // requestAnimationFrame(render)
}

render()
// compute 2D paths that depict the 3D scene
