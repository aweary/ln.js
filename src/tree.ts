import { Box, boxForShapes } from "./box";
import Ray from "./ray";
import Hit, { NoHit } from "./hit";
import { ShapeT } from "./shape";
import { Axis } from "./axis";
import { median } from "./math";

export class Tree {
  box: Box;
  root: Node;

  constructor(shapes: Array<ShapeT>) {
    this.box = boxForShapes(shapes);
    const node = new Node(shapes);
    node.split(0);
    this.root = node;
  }

  intersect(r: Ray): Hit {
    // ISSUE: tmax is always negative
    const [tmin, tmax] = this.box.intersect(r);
    if (tmax < tmin || tmax <= 0) {
      return NoHit;
    }
    return this.root.intersect(r, tmin, tmax);
  }
}

export class Node {
  axis: Axis;
  point: number;
  shapes: Array<ShapeT>;
  left: Node;
  right: Node;
  constructor(shapes: Array<ShapeT>) {
    this.axis = Axis.AxisNone;
    this.point = 0;
    this.shapes = shapes;
    left: null;
    right: null;
  }

  intersect(r: Ray, tmin: number, tmax: number): Hit {
    let tsplit: number;
    let leftFirst: boolean;
    switch (this.axis) {
      case Axis.AxisNone:
        return this.intersectShapes(r);
      case Axis.AxisX: {
        tsplit = (this.point - r.origin.x) / r.direction.x;
        leftFirst =
          r.origin.x < this.point ||
          (r.origin.x === this.point && r.direction.x <= 0);
      }
      case Axis.AxisY: {
        tsplit = (this.point - r.origin.y) / r.direction.y;
        leftFirst =
          r.origin.y < this.point ||
          (r.origin.y === this.point && r.direction.y <= 0);
      }
      case Axis.AxisZ: {
        tsplit = (this.point - r.origin.z) / r.direction.z;
        leftFirst =
          r.origin.z < this.point ||
          (r.origin.z === this.point && r.direction.z <= 0);
      }
    }
    let first: Node;
    let second: Node;
    if (leftFirst) {
      first = this.left;
      second = this.right;
    } else {
      first = this.right;
      second = this.left;
    }
    if (tsplit > tmax || tsplit <= 0) {
      return first.intersect(r, tmin, tmax);
    } else if (tsplit < tmin) {
      return second.intersect(r, tmin, tmax);
    } else {
      let h1 = first.intersect(r, tmin, tsplit);
      if (h1.t <= tsplit) {
        return h1;
      }
      let h2 = second.intersect(r, tsplit, Math.min(tmax, h1.t));
      if (h1.t <= h2.t) {
        return h1;
      } else {
        return h2;
      }
    }
  }

  intersectShapes(r: Ray): Hit {
    let hit: Hit = NoHit;
    for (const shape of this.shapes) {
      let h = shape.intersect(r);
      if (h.t < hit.t) {
        hit = h;
      }
    }
    return hit;
  }

  partitionScore(axis: Axis, point: number): number {
    let left = 0;
    let right = 0;
    for (const shape of this.shapes) {
      let box = shape.boundingBox();
      let [l, r] = box.partition(axis, point);
      if (l) {
        left++;
      }
      if (r) {
        right++;
      }
    }
    if (left >= right) {
      return left;
    } else {
      return right;
    }
  }

  partition(
    size: number,
    axis: Axis,
    point: number
  ): [Array<ShapeT>, Array<ShapeT>] {
    let left: Array<ShapeT> = new Array(size);
    let right: Array<ShapeT> = new Array(size);
    for (const shape of this.shapes) {
      const box = shape.boundingBox();
      const [l, r] = box.partition(axis, point);
      if (l) {
        left.push(shape);
      }
      if (r) {
        right.push(shape);
      }
    }
    return [left, right];
  }

  split(depth: number) {
    if (this.shapes.length < 8) {
      return;
    }
    let xs: Array<number> = new Array(this.shapes.length * 2);
    let ys: Array<number> = new Array(this.shapes.length * 2);
    let zs: Array<number> = new Array(this.shapes.length * 2);
    for (const shape of this.shapes) {
      const box = shape.boundingBox();
      xs.push(box.min.x);
      xs.push(box.max.x);
      ys.push(box.min.y);
      ys.push(box.max.y);
      zs.push(box.min.z);
      zs.push(box.max.z);
    }
    xs.sort((a, b) => a - b);
    ys.sort((a, b) => a - b);
    zs.sort((a, b) => a - b);
    let mx = median(xs);
    let my = median(ys);
    let mz = median(zs);
    let best = (this.shapes.length * 0.85) | 0;
    let bestAxis = Axis.AxisNone;
    let bestPoint = 0.0;
    let sx = this.partitionScore(Axis.AxisX, mx);
    if (sx < best) {
      best = sx;
      bestAxis = Axis.AxisX;
      bestPoint = mx;
    }
    let sy = this.partitionScore(Axis.AxisY, my);
    if (sy < best) {
      best = sy;
      bestAxis = Axis.AxisY;
      bestPoint = my;
    }
    let sz = this.partitionScore(Axis.AxisZ, mz);
    if (sz < best) {
      best = sz;
      bestAxis = Axis.AxisZ;
      bestPoint = mz;
    }
    if (bestAxis === Axis.AxisNone) {
      return;
    }
    let [l, r] = this.partition(best, bestAxis, bestPoint);
    this.axis = bestAxis;
    this.point = bestPoint;
    this.left = new Node(l);
    this.right = new Node(r);
    this.left.split(depth + 1);
    this.right.split(depth + 1);
    this.shapes = null;
  }
}
