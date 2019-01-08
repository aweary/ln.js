import { ShapeT, EmptyShape } from "./shape";
import { FilterT } from "./filter";
import Vector from "./vector";
import Ray from "./ray";
import Hit from "./hit";
import * as Paths from "./paths";

export enum CSGOperation {
  Intersection,
  Difference,
  Union
}

export class BooleanShape implements ShapeT, FilterT {
  op: CSGOperation;
  a: ShapeT;
  b: ShapeT;

  static create(op: CSGOperation, ...shapes: ShapeT[]): ShapeT {
    if (shapes.length === 0) {
      return new EmptyShape();
    }
    let shape = shapes[0];
    for (let i = 1; i < shapes.length; i++) {
      shape = new BooleanShape(op, shape, shapes[i]);
    }
    return shape;
  }

  constructor(op: CSGOperation, a: ShapeT, b: ShapeT) {
    this.op = op;
    this.a = a;
    this.b = b;
  }

  compile() {
    // Noop
  }

  boundingBox() {
    let a = this.a.boundingBox();
    let b = this.b.boundingBox();
    return a.extend(b);
  }

  contains(v: Vector, f: number): boolean {
    f = 1e-3;
    switch (this.op) {
      case CSGOperation.Intersection:
        return this.a.contains(v, f) && this.b.contains(v, f);
      case CSGOperation.Difference:
        return this.a.contains(v, f) && !this.b.contains(v, -f);
    }
    return false;
  }

  intersect(r: Ray): Hit {
    let h1 = this.a.intersect(r);
    let h2 = this.b.intersect(r);
    let h = h1.min(h2);
    let v = r.position(h.t);
    if (!h.ok() || this.contains(v, 0)) {
      return h;
    }
    return this.intersect(new Ray(r.position(h.t + 0.01), r.direction));
  }

  paths() {
    let a = this.a.paths();
    let b = this.b.paths();
    let p = a.concat(b);
    return Paths.filterPaths(Paths.chop(p, 0.01), this);
  }

  filter(v: Vector): [Vector, boolean] {
    return [v, this.contains(v, 0)];
  }
}
