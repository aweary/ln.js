import { ShapeT } from "./shape";
import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit, { NoHit } from "./hit";
import { Paths } from "./paths";
import { Path } from "./path";
import { radians } from "./math";

export enum Direction {
  Above,
  Below
}

export type ShapeFn = (x: number, y: number) => number;

export class Function implements ShapeT {
  fn: ShapeFn;
  box: Box;
  direction: Direction;
  constructor(fn: ShapeFn, box: Box, direction: Direction) {
    this.fn = fn;
    this.box = box;
    this.direction = direction;
  }

  compile() {
    // Noop
  }

  boundingBox(): Box {
    return this.box;
  }

  contains(v: Vector, eps: number): boolean {
    if ((this.direction = Direction.Below)) {
      return v.z < this.fn(v.x, v.y);
    }
    return v.z > this.fn(v.x, v.y);
  }

  intersect(ray: Ray): Hit {
    let step = 1 / 64;
    let sign = this.contains(ray.position(step), 0);
    for (let t = step; t < 10; t += step) {
      let v = ray.position(t);
      if (this.contains(v, 0) !== sign && this.box.contains(v)) {
        return new Hit(this, t);
      }
    }
    return NoHit;
  }

  paths(): Paths {
    var paths: Paths = [];
    let fine = 1.0 / 256;
    for (let a = 0; a < 360; a += 5) {
      var path: Path = [];
      for (let r = 0.0; r <= 8.0; r += fine) {
        let x = Math.cos(radians(a)) * r;
        let y = Math.sin(radians(a)) * r;
        let z = this.fn(x, y);
        let o = -Math.pow(-z, 1.4);
        x = Math.cos(radians(a) - o) * r;
        y = Math.sin(radians(a) - o) * r;
        z = Math.min(z, this.box.max.z);
        z = Math.max(z, this.box.min.z);
        path.push(new Vector(x, y, z));
      }
      paths.push(path);
    }
    return paths;
  }
}
