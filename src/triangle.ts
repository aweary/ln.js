import { ShapeT } from "./shape";
import Vector from "./vector";
import { Box } from "./box";
import Hit, { NoHit } from "./hit";
import Ray from "./ray";
import { Paths } from "./paths";

const EPS = 1e-9;

export default class Triangle implements ShapeT {
  v1: Vector;
  v2: Vector;
  v3: Vector;
  box: Box;
  constructor(v1: Vector, v2: Vector, v3: Vector) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.box = this.calculateBoundingBox();
  }

  toString() {
    return `v1: ${this.v1} v2: ${this.v2} v3: ${this.v3}`
  }

  calculateBoundingBox(): Box {
    let min = this.v1.min(this.v2).min(this.v3);
    let max = this.v1.max(this.v2).max(this.v3);
    return new Box(min, max);
  }

  updateBoundingBox(): void {
    const box = this.calculateBoundingBox();
    this.box = box;
  }

  compile() {
    // Noop
  }

  boundingBox(): Box {
    return this.box;
  }

  contains(v: Vector, f: number): boolean {
    return false;
  }

  intersect(r: Ray): Hit {
    let e1x = this.v2.x - this.v1.x;
    let e1y = this.v2.y - this.v1.y;
    let e1z = this.v2.z - this.v1.z;
    let e2x = this.v3.x - this.v1.x;
    let e2y = this.v3.y - this.v1.y;
    let e2z = this.v3.z - this.v1.z;
    let px = r.direction.y * e2z - r.direction.z * e2y;
    let py = r.direction.z * e2x - r.direction.x * e2z;
    let pz = r.direction.x * e2y - r.direction.y * e2x;
    let det = e1x * px + e1y * py + e1z * pz;
    if (det > -EPS && det < EPS) {
      return NoHit;
    }
    let inv = 1 / det;
    let tx = r.origin.x - this.v1.x;
    let ty = r.origin.y - this.v1.y;
    let tz = r.origin.z - this.v1.z;
    let u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) {
      return NoHit;
    }
    let qx = ty * e1z - tz * e1y;
    let qy = tz * e1x - tx * e1z;
    let qz = tx * e1y - ty * e1x;
    let v =
      (r.direction.x * qx + r.direction.y * qy + r.direction.z * qz) * inv;
    if (v < 0 || u + v > 1) {
      return NoHit;
    }
    let d = (e2x * qx + e2y * qy + e2z * qz) * inv;
    if (d < EPS) {
      return NoHit;
    }
    return new Hit(this, d);
  }

  paths(): Paths {
    return [[this.v1, this.v2], [this.v2, this.v3], [this.v3, this.v1]];
  }
}
