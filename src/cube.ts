import Vector from "./vector";
import { Box } from "./box";
import { ShapeT } from "./shape";
import Hit, { NoHit } from "./hit";
import Ray from "./ray";
import { Paths } from "./paths";

export default class Cube implements ShapeT {
  min: Vector;
  max: Vector;
  box: Box;
  constructor(min: Vector, max: Vector) {
    this.min = min;
    this.max = max;
    this.box = new Box(min, max);
  }

  compile() {
    // noop
  }

  boundingBox(): Box {
    return this.box;
  }

  contains(v: Vector, f: number): boolean {
    if (v.x < this.min.x - f || v.x > this.max.x + f) {
      return false;
    }
    if (v.y < this.min.y - f || v.y > this.max.y + f) {
      return false;
    }
    if (v.z < this.min.z - f || v.z > this.max.z + f) {
      return false;
    }
    return true;
  }

  intersect(r: Ray): Hit {
    let f = this.max.sub(r.origin).div(r.direction);
    let n = this.min.sub(r.origin).div(r.direction);
    [n, f] = [n.min(f), n.max(f)];
    let t0 = Math.max(Math.max(n.x, n.y), n.z);
    let t1 = Math.min(Math.min(f.x, f.y), f.z);
    if (t0 < 1e-3 && t1 > 1e-3) {
      return new Hit(this, t1);
    }
    if (t0 >= 1e-3 && t0 < t1) {
      return new Hit(this, t0);
    }
    return NoHit;
  }

  paths(): Paths {
    let [x1, y1, z1] = [this.min.x, this.min.y, this.min.z];
    let [x2, y2, z2] = [this.max.x, this.max.y, this.max.z];
    return [
      [new Vector(x1, y1, z1), new Vector(x1, y1, z2)],
      [new Vector(x1, y1, z1), new Vector(x1, y2, z1)],
      [new Vector(x1, y1, z1), new Vector(x2, y1, z1)],
      [new Vector(x1, y1, z2), new Vector(x1, y2, z2)],
      [new Vector(x1, y1, z2), new Vector(x2, y1, z2)],
      [new Vector(x1, y2, z1), new Vector(x1, y2, z2)],
      [new Vector(x1, y2, z1), new Vector(x2, y2, z1)],
      [new Vector(x1, y2, z2), new Vector(x2, y2, z2)],
      [new Vector(x2, y1, z1), new Vector(x2, y1, z2)],
      [new Vector(x2, y1, z1), new Vector(x2, y2, z1)],
      [new Vector(x2, y1, z2), new Vector(x2, y2, z2)],
      [new Vector(x2, y2, z1), new Vector(x2, y2, z2)]
    ];
  }
}
