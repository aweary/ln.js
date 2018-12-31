import Ray from "./ray";
import { ShapeT } from "./shape";
import Vector from "./vector";
import { Axis } from "./axis";
import Triangle from "./triangle"

export type PointPair = [number, number];

export class Box {
  min: Vector;
  max: Vector;

  constructor(min?: Vector, max?: Vector) {
    // TODO is this right? Does it default to 0, 0, 0?
    this.min = min || new Vector(0, 0, 0);
    this.max = max || new Vector(0, 0, 0);
  }

  anchor(anchor: Vector): Vector {
    return this.min.add(this.size().mul(anchor));
  }

  center(): Vector {
    return this.anchor(new Vector(0.5, 0.5, 0.5));
  }

  size(): Vector {
    return this.max.sub(this.min);
  }

  contains(b: Vector): boolean {
    let { min, max } = this;
    return (
      min.x <= b.x &&
      max.x >= b.x &&
      min.y <= b.y &&
      max.y >= b.y &&
      min.z <= b.z &&
      max.z >= b.z
    );
  }

  extend(b: Box): Box {
    let min = this.min.min(b.min);
    let max = this.max.max(b.max);
    return new Box(min, max);
  }

  intersect(r: Ray): [number, number] {
    let x1 = (this.min.x - r.origin.x) / r.direction.x;
    let y1 = (this.min.y - r.origin.y) / r.direction.y;
    let z1 = (this.min.z - r.origin.z) / r.direction.z;
    let x2 = (this.max.x - r.origin.x) / r.direction.x;
    let y2 = (this.max.y - r.origin.y) / r.direction.y;
    let z2 = (this.max.z - r.origin.z) / r.direction.z;
    if (x1 > x2) {
      [x1, x2] = [x2, x1];
    }
    if (y1 > y2) {
      [y1, y2] = [y2, y1];
    }
    if (z1 > z2) {
      [z1, z2] = [z2, z1];
    }
    let t1 = Math.max(Math.max(x1, y1), z1);
    let t2 = Math.min(Math.min(x2, y2), z2);
    return [t1, t2];
  }

  partition(axis: Axis, point: number): [boolean, boolean] {
    switch (axis) {
      case Axis.AxisX: {
        let left = this.min.x <= point;
        let right = this.max.x >= point;
        return [left, right];
      }
      case Axis.AxisY: {
        let left = this.min.y <= point;
        let right = this.max.y >= point;
        return [left, right];
      }
      case Axis.AxisZ: {
        let left = this.min.z <= point;
        let right = this.max.z >= point;
        return [left, right];
      }
    }
    throw new Error(`Partitioning NoAxis`)
  }
}

export function boxForShapes(shapes: Array<ShapeT>): Box {
  if (shapes.length === 0) {
    // TODO empty box?
    return new Box();
  }
  let box = shapes[0].boundingBox();
  for (const shape of shapes) {
    box = box.extend(shape.boundingBox());
  }
  return box;
}
