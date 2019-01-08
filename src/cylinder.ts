import { ShapeT } from "./shape";
import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit, { NoHit } from "./hit";
import { Paths } from "./paths";
import { Path } from "./path";
import { radians } from "./math";

export class Cylinder implements ShapeT {
  radius: number;
  z0: number;
  z1: number;

  constructor(radius: number, z0: number, z1: number) {
    this.radius = radius;
    this.z0 = z0;
    this.z1 = z1;
  }

  compile() {
    // noop
  }

  boundingBox(): Box {
    let r = this.radius;
    let min = new Vector(-r, -r, this.z0);
    let max = new Vector(r, r, this.z1);
    return new Box(min, max);
  }

  contains(v: Vector, f: number): boolean {
    let xy = new Vector(v.x, v.y, 0);
    if (xy.length() > this.radius + f) {
      return false;
    }
    return v.z >= this.z0 - f && v.z <= this.z1 + f;
  }

  intersect(ray: Ray): Hit {
    let r = this.radius;
    let o = ray.origin;
    let d = ray.direction;
    let a = d.x * d.x + d.y * d.y;
    let b = 2 * o.x * d.x + 2 * o.y * d.y;
    let c = o.x * o.x + o.y * o.y - r * r;
    let q = b * b - 4 * a * c;
    if (q < 0) {
      return NoHit;
    }
    let s = Math.sqrt(q);
    let t0 = (-b + s) / (2 * a);
    let t1 = (-b - s) / (2 * a);
    if (t0 > t1) {
      [t0, t1] = [t1, t0];
    }
    let z0 = o.z + t0 * d.z;
    let z1 = o.z + t1 * d.z;
    if (t0 > 1e-6 && this.z0 < z0 && z0 < this.z1) {
      return new Hit(this, t0);
    }
    if (t1 > 1e-6 && this.z0 < z1 && z1 < this.z1) {
      return new Hit(this, t1);
    }
    return NoHit;
  }

  paths(): Paths {
    let result: Paths = [];
    for (let a = 0; a < 360; a += 10) {
      let x = this.radius * Math.cos(radians(a));
      let y = this.radius * Math.sin(radians(a));
      let p: Path = [new Vector(x, y, this.z0), new Vector(x, y, this.z1)];
      result.push(p);
    }
    return result;
  }
}

export class OutlineCylinder extends Cylinder {
  eye: Vector;
  up: Vector;
  constructor(eye: Vector, up: Vector, radius: number, z0: number, z1: number) {
    super(radius, z0, z1);
    this.eye = eye;
    this.up = up;
  }

  paths(): Paths {
    let center = new Vector(0, 0, this.z0);
    let hyp = center.sub(this.eye).length();
    let opp = this.radius;
    let theta = Math.asin(opp / hyp);
    let adj = opp / Math.tan(theta);
    let d = Math.cos(theta) * adj;
    let w = center.sub(this.eye).normalize();
    let u = w.cross(this.up).normalize();
    let c0 = this.eye.add(w.multiplyScalar(d));
    let a0 = c0.add(u.multiplyScalar(this.radius * 1.01));
    let b0 = c0.add(u.multiplyScalar(-this.radius * 1.01));

    center = new Vector(0, 0, this.z1);
    hyp = center.sub(this.eye).length();
    opp = this.radius;
    theta = Math.asin(opp / hyp);
    adj = opp / Math.tan(theta);
    d = Math.cos(theta) * adj;
    w = center.sub(this.eye).normalize();
    u = w.cross(this.up).normalize();
    let c1 = this.eye.add(w.multiplyScalar(d));
    let a1 = c1.add(u.multiplyScalar(this.radius * 1.01));
    let b1 = c1.add(u.multiplyScalar(-this.radius * 1.01));
    let p0: Path = [];
    let p1: Path = [];
    for (let a = 0; a < 360; a++) {
      let x = this.radius * Math.cos(radians(a));
      let y = this.radius * Math.sin(radians(a));
      p0.push(new Vector(x, y, this.z0));
      p1.push(new Vector(x, y, this.z1));
    }
    return [
      p0,
      p1,
      [new Vector(a0.x, a0.y, this.z0), new Vector(a1.x, a1.y, this.z1)],
      [new Vector(b0.x, b0.y, this.z0), new Vector(b1.x, b1.y, this.z1)]
    ];
  }
}

// TODO NewTransformedOutlineCycliner