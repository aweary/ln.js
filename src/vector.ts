import { Hashable } from "./set";

export default class Vector implements Hashable {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  hashCode(): string {
    let { x, y, z } = this;
    return `${x}#${y}#${z}`;
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}, z: ${this.z}}`;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  distance(b: Vector): number {
    return this.sub(b).length();
  }

  lengthSquared(): number {
    let { x, y, z } = this;
    return x * x + y * y + z + z;
  }

  distanceSquared(b: Vector): number {
    return this.sub(b).lengthSquared();
  }

  dot(b: Vector): number {
    let { x, y, z } = this;
    return x * b.x + y * b.y + z * b.z;
  }

  cross(b: Vector): Vector {
    let x = this.y * b.z - this.z * b.y;
    let y = this.z * b.x - this.x * b.z;
    let z = this.x * b.y - this.y * b.x;
    return new Vector(x, y, z);
  }

  normalize(): Vector {
    let len = this.length();
    return new Vector(this.x / len, this.y / len, this.z / len);
  }

  add(b: Vector): Vector {
    let { x, y, z } = this;
    return new Vector(x + b.x, y + b.y, z + b.z);
  }

  sub(b: Vector): Vector {
    let { x, y, z } = this;
    return new Vector(x - b.x, y - b.y, z - b.z);
  }

  mul(b: Vector): Vector {
    let { x, y, z } = this;
    return new Vector(x * b.x, y * b.y, z * b.z);
  }

  div(b: Vector): Vector {
    let { x, y, z } = this;
    return new Vector(x / b.x, y / b.y, z / b.z);
  }

  addScalar(b: number): Vector {
    let { x, y, z } = this;
    return new Vector(x + b, y + b, z + b);
  }

  subScalar(b: number): Vector {
    let { x, y, z } = this;
    return new Vector(x - b, y - b, z - b);
  }

  multiplyScalar(b: number): Vector {
    let { x, y, z } = this;
    return new Vector(x * b, y * b, z * b);
  }

  divScalar(b: number): Vector {
    let { x, y, z } = this;
    return new Vector(x / b, y / b, z / b);
  }

  min(b: Vector): Vector {
    let x = Math.min(this.x, b.x);
    let y = Math.min(this.y, b.y);
    let z = Math.min(this.z, b.z);
    return new Vector(x, y, z);
  }

  max(b: Vector): Vector {
    let x = Math.max(this.x, b.x);
    let y = Math.max(this.y, b.y);
    let z = Math.max(this.z, b.z);
    return new Vector(x, y, z);
  }

  minAxis(): Vector {
    let x = Math.abs(this.x);
    let y = Math.abs(this.y);
    let z = Math.abs(this.z);
    if (x <= y && x <= z) {
      return new Vector(1, 0, 0);
    }
    if (y <= x && y <= z) {
      return new Vector(0, 1, 0);
    }
    return new Vector(0, 0, 1);
  }

  minComponent(): number {
    return Math.min(this.x, this.y, this.z);
  }

  segmentDistance(v: Vector, w: Vector): number {
    let l2 = v.distanceSquared(w);
    if (l2 === 0) {
      return this.distance(v);
    }
    let t = this.sub(v).dot(w.sub(v)) / l2;
    if (t < 0) {
      return this.distance(v);
    }
    if (t > 1) {
      return this.distance(w);
    }
    return v.add(w.sub(v).multiplyScalar(t)).distance(this);
  }
}
