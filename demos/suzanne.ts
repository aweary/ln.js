// @ts-ignore
import obj from "./suzanne.obj";
import * as ln from "../src";
import { isContext } from "vm";

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.translate(0.5, 0.5);

let stl: string = obj;

async function fetchSTLFile(path: string): Promise<string> {
  const obj = await window.fetch(path).then(res => res.text());
  return obj;
}


function parseData(data: string) {
  let rotate = 0.5;
  let mesh = ln.loadOBJ(data);
  mesh.unitCube();

  let width = window.innerWidth;
  let height = window.innerHeight;

  let eye = new ln.Vector(-0.5, 0.5, 2);
  let center = new ln.Vector(0, 0, 0);
  let up = new ln.Vector(0, 1, 0);

  function render() {
    ctx.clearRect(0, 0, width, height);
    let scene = new ln.Scene();
    rotate += 0.01;
    scene.add(
      new ln.TransformedShape(mesh, ln.rotate(new ln.Vector(-1, -0.5, 0), rotate))
    );
    let paths = scene.render(
      eye,
      center,
      up,
      width,
      height,
      35,
      0.1,
      100,
      0.01
    );
    paths.forEach(path => {
      ctx.beginPath();
      path.forEach((v, i) => {
        ctx.lineTo(width - v.x, height - v.y);
      });
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    requestAnimationFrame(render);
  }
  render()
}

fetchSTLFile(stl).then(data => parseData(data));
