import { ShapeT } from "./shape";
import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit, { NoHit } from "./hit";
import { Paths } from "./paths";
import { Path } from "./path";
import { radians } from "./math";

export default class Cone implements ShapeT {
  radius: number;
  height: number;
  constructor(radius: number, height: number) {
    this.radius = radius;
    this.height = height;
  }

  compile() {
    // noop
  }

  boundingBox(): Box {
    let r = this.radius;
    return new Box(new Vector(-r, -r, 0), new Vector(r, r, this.height));
  }

  contains(v: Vector, f: number): boolean {
    // TODO is this right, or was this just not implemented in ln?
    return false;
  }

  intersect(ray: Ray): Hit {
    let o = ray.origin;
    let d = ray.direction;
    let r = this.radius;
    let h = this.height;

    let k = r / h;
    k = k * k;

    let a = d.x * d.x + d.y * d.y - k * d.z * d.z;
    let b = 2 * (d.x * o.x + d.y * o.y - k * d.z * (o.z - h));
    let c = o.x * o.x + o.y * o.y - k * (o.z - h) * (o.z - h);
    let q = b * b - 4 * a * c;
    if (q <= 0) {
      return NoHit;
    }
    let s = Math.sqrt(q);
    let t0 = (-b + s) / (2 * a);
    let t1 = (-b - s) / (2 * a);
    if (t0 > t1) {
      [t0, t1] = [t1, t0];
    }
    if (t0 > 1e-6) {
      let p = ray.position(t0);
      if (p.z > 0 && p.z < h) {
        return new Hit(this, t0);
      }
    }
    if (t1 > 1e-6) {
      let p = ray.position(t1);
      if (p.z > 0 && p.z < h) {
        return new Hit(this, t1);
      }
    }
    return NoHit;
  }

  paths(): Paths {
    let result: Paths = [];
    for (let a = 0; a < 360; a += 30) {
      let x = this.radius * Math.cos(radians(a));
      let y = this.radius * Math.sin(radians(a));
      let p: Path = [new Vector(x, y, 0), new Vector(0, 0, this.height)];
      result.push(p);
    }
    return result;
  }
}
