import Vector from "./vector";
import Triangle from "./triangle";
import { Paths } from "./paths";
import Mesh from "./mesh";

const EPS = 1e-9;

export default class Plane {
  point: Vector;
  normal: Vector;

  constructor(point: Vector, normal: Vector) {
    this.point = point;
    this.normal = normal;
  }

  intersectSegment(v0: Vector, v1: Vector): [Vector, boolean] {
    let u = v1.sub(v0);
    let w = v0.sub(this.point);
    let d = this.normal.dot(u);
    let n = -this.normal.dot(w);
    if (d > -EPS && d < EPS) {
      return [new Vector(0, 0, 0), false];
    }
    let t = n / d;
    if (t < 0 || t > 1) {
      return [new Vector(0, 0, 0), false];
    }
    let v = v0.add(u.multiplyScalar(t));
    return [v, true];
  }

  intersectTriangle(t: Triangle): [Vector, Vector, boolean] {
    let [v1, ok1] = this.intersectSegment(t.v1, t.v2);
    let [v2, ok2] = this.intersectSegment(t.v2, t.v3);
    let [v3, ok3] = this.intersectSegment(t.v3, t.v1);
    if (ok1 && ok2) {
      return [v1, v2, true];
    }
    if (ok1 && ok3) {
      return [v1, v3, true];
    }
    if (ok2 && ok3) {
      return [v2, v3, true];
    }
    return [new Vector(0, 0, 0), new Vector(0, 0, 0), false];
  }

  intersectMesh(m: Mesh): Paths {
    let result: Paths = [];
    for (const t of m.triangles) {
      let [v1, v2, ok] = this.intersectTriangle(t);
      if (ok) {
        result.push([v1, v2]);
      }
    }
    return result;
  }
}
