import Vector from "./vector";
import Ray from "./ray";
import { Box } from "./box";

/**
 * lol this is terrible
 */
export class Matrix {
  // prettier-ignore-start
  x00: number;
  x01: number;
  x02: number;
  x03: number;
  x10: number;
  x11: number;
  x12: number;
  x13: number;
  x20: number;
  x21: number;
  x22: number;
  x23: number;
  x30: number;
  x31: number;
  x32: number;
  x33: number;
  constructor(
    x00?: number,
    x01?: number,
    x02?: number,
    x03?: number,
    x10?: number,
    x11?: number,
    x12?: number,
    x13?: number,
    x20?: number,
    x21?: number,
    x22?: number,
    x23?: number,
    x30?: number,
    x31?: number,
    x32?: number,
    x33?: number
  ) {
    this.x00 = x00 || 0;
    this.x01 = x01 || 0;
    this.x02 = x02 || 0;
    this.x03 = x03 || 0;
    this.x10 = x10 || 0;
    this.x11 = x11 || 0;
    this.x12 = x12 || 0;
    this.x13 = x13 || 0;
    this.x20 = x20 || 0;
    this.x21 = x21 || 0;
    this.x22 = x22 || 0;
    this.x23 = x23 || 0;
    this.x30 = x30 || 0;
    this.x31 = x31 || 0;
    this.x32 = x32 || 0;
    this.x33 = x33 || 0;
  }

  translate(v: Vector): Matrix {
    return translate(v).mul(this);
  }

  scale(v: Vector): Matrix {
    return scale(v).mul(this);
  }

  rotate(v: Vector, a: number): Matrix {
    return rotate(v, a).mul(this);
  }

  frustrum(
    l: number,
    r: number,
    b: number,
    t: number,
    n: number,
    f: number
  ): Matrix {
    return frustrum(l, r, b, t, n, f).mul(this);
  }

  orthographic(
    l: number,
    r: number,
    b: number,
    t: number,
    n: number,
    f: number
  ): Matrix {
    return orthographic(l, r, b, t, n, f).mul(this);
  }

  perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
    return perspective(fovy, aspect, near, far).mul(this);
  }

  mul(b: Matrix): Matrix {
    let m = new Matrix();
    m.x00 =
      this.x00 * b.x00 + this.x01 * b.x10 + this.x02 * b.x20 + this.x03 * b.x30;
    m.x10 =
      this.x10 * b.x00 + this.x11 * b.x10 + this.x12 * b.x20 + this.x13 * b.x30;
    m.x20 =
      this.x20 * b.x00 + this.x21 * b.x10 + this.x22 * b.x20 + this.x23 * b.x30;
    m.x30 =
      this.x30 * b.x00 + this.x31 * b.x10 + this.x32 * b.x20 + this.x33 * b.x30;
    m.x01 =
      this.x00 * b.x01 + this.x01 * b.x11 + this.x02 * b.x21 + this.x03 * b.x31;
    m.x11 =
      this.x10 * b.x01 + this.x11 * b.x11 + this.x12 * b.x21 + this.x13 * b.x31;
    m.x21 =
      this.x20 * b.x01 + this.x21 * b.x11 + this.x22 * b.x21 + this.x23 * b.x31;
    m.x31 =
      this.x30 * b.x01 + this.x31 * b.x11 + this.x32 * b.x21 + this.x33 * b.x31;
    m.x02 =
      this.x00 * b.x02 + this.x01 * b.x12 + this.x02 * b.x22 + this.x03 * b.x32;
    m.x12 =
      this.x10 * b.x02 + this.x11 * b.x12 + this.x12 * b.x22 + this.x13 * b.x32;
    m.x22 =
      this.x20 * b.x02 + this.x21 * b.x12 + this.x22 * b.x22 + this.x23 * b.x32;
    m.x32 =
      this.x30 * b.x02 + this.x31 * b.x12 + this.x32 * b.x22 + this.x33 * b.x32;
    m.x03 =
      this.x00 * b.x03 + this.x01 * b.x13 + this.x02 * b.x23 + this.x03 * b.x33;
    m.x13 =
      this.x10 * b.x03 + this.x11 * b.x13 + this.x12 * b.x23 + this.x13 * b.x33;
    m.x23 =
      this.x20 * b.x03 + this.x21 * b.x13 + this.x22 * b.x23 + this.x23 * b.x33;
    m.x33 =
      this.x30 * b.x03 + this.x31 * b.x13 + this.x32 * b.x23 + this.x33 * b.x33;
    return m;
  }

  mulPosition(b: Vector): Vector {
    let x = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z + this.x03;
    let y = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z + this.x13;
    let z = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z + this.x23;
    return new Vector(x, y, z);
  }

  mulPositionW(b: Vector): Vector {
    let x = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z + this.x03;
    let y = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z + this.x13;
    let z = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z + this.x23;
    let w = this.x30 * b.x + this.x31 * b.y + this.x32 * b.z + this.x33;
    return new Vector(x / w, y / w, z / w);
  }

  mulDirection(b: Vector): Vector {
    let x = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z;
    let y = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z;
    let z = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z;
    return new Vector(x, y, z).normalize();
  }

  mulRay(b: Ray): Ray {
    return new Ray(this.mulPosition(b.origin), this.mulDirection(b.direction));
  }

  mulBox(box: Box): Box {
    let r = new Vector(this.x00, this.x10, this.x20);
    let u = new Vector(this.x01, this.x11, this.x21);
    let b = new Vector(this.x02, this.x12, this.x22);
    let t = new Vector(this.x03, this.x13, this.x23);
    let xa = r.multiplyScalar(box.min.x);
    let xb = r.multiplyScalar(box.max.x);
    let ya = u.multiplyScalar(box.min.y);
    let yb = u.multiplyScalar(box.max.y);
    let za = b.multiplyScalar(box.min.z);
    let zb = b.multiplyScalar(box.max.z);
    [xa, xb] = [xa.min(xb), xa.max(xb)];
    [ya, yb] = [ya.min(yb), ya.max(yb)];
    [za, zb] = [za.min(zb), za.max(zb)];
    let min = xa
      .add(ya)
      .add(za)
      .add(t);
    let max = xb
      .add(yb)
      .add(zb)
      .add(t);
    return new Box(min, max);
  }

  transpose(): Matrix {
    // prettier-ignore
    return new Matrix(
		this.x00, this.x10, this.x20, this.x30,
		this.x01, this.x11, this.x21, this.x31,
		this.x02, this.x12, this.x22, this.x32,
        this.x03, this.x13, this.x23, this.x33
    )
  }

  determinant(): number {
    return (
      this.x00 * this.x11 * this.x22 * this.x33 -
      this.x00 * this.x11 * this.x23 * this.x32 +
      this.x00 * this.x12 * this.x23 * this.x31 -
      this.x00 * this.x12 * this.x21 * this.x33 +
      this.x00 * this.x13 * this.x21 * this.x32 -
      this.x00 * this.x13 * this.x22 * this.x31 -
      this.x01 * this.x12 * this.x23 * this.x30 +
      this.x01 * this.x12 * this.x20 * this.x33 -
      this.x01 * this.x13 * this.x20 * this.x32 +
      this.x01 * this.x13 * this.x22 * this.x30 -
      this.x01 * this.x10 * this.x22 * this.x33 +
      this.x01 * this.x10 * this.x23 * this.x32 +
      this.x02 * this.x13 * this.x20 * this.x31 -
      this.x02 * this.x13 * this.x21 * this.x30 +
      this.x02 * this.x10 * this.x21 * this.x33 -
      this.x02 * this.x10 * this.x23 * this.x31 +
      this.x02 * this.x11 * this.x23 * this.x30 -
      this.x02 * this.x11 * this.x20 * this.x33 -
      this.x03 * this.x10 * this.x21 * this.x32 +
      this.x03 * this.x10 * this.x22 * this.x31 -
      this.x03 * this.x11 * this.x22 * this.x30 +
      this.x03 * this.x11 * this.x20 * this.x32 -
      this.x03 * this.x12 * this.x20 * this.x31 +
      this.x03 * this.x12 * this.x21 * this.x30
    );
  }

  inverse(): Matrix {
    let m = new Matrix();
    let d = this.determinant();
    m.x00 =
      (this.x12 * this.x23 * this.x31 -
        this.x13 * this.x22 * this.x31 +
        this.x13 * this.x21 * this.x32 -
        this.x11 * this.x23 * this.x32 -
        this.x12 * this.x21 * this.x33 +
        this.x11 * this.x22 * this.x33) /
      d;
    m.x01 =
      (this.x03 * this.x22 * this.x31 -
        this.x02 * this.x23 * this.x31 -
        this.x03 * this.x21 * this.x32 +
        this.x01 * this.x23 * this.x32 +
        this.x02 * this.x21 * this.x33 -
        this.x01 * this.x22 * this.x33) /
      d;
    m.x02 =
      (this.x02 * this.x13 * this.x31 -
        this.x03 * this.x12 * this.x31 +
        this.x03 * this.x11 * this.x32 -
        this.x01 * this.x13 * this.x32 -
        this.x02 * this.x11 * this.x33 +
        this.x01 * this.x12 * this.x33) /
      d;
    m.x03 =
      (this.x03 * this.x12 * this.x21 -
        this.x02 * this.x13 * this.x21 -
        this.x03 * this.x11 * this.x22 +
        this.x01 * this.x13 * this.x22 +
        this.x02 * this.x11 * this.x23 -
        this.x01 * this.x12 * this.x23) /
      d;
    m.x10 =
      (this.x13 * this.x22 * this.x30 -
        this.x12 * this.x23 * this.x30 -
        this.x13 * this.x20 * this.x32 +
        this.x10 * this.x23 * this.x32 +
        this.x12 * this.x20 * this.x33 -
        this.x10 * this.x22 * this.x33) /
      d;
    m.x11 =
      (this.x02 * this.x23 * this.x30 -
        this.x03 * this.x22 * this.x30 +
        this.x03 * this.x20 * this.x32 -
        this.x00 * this.x23 * this.x32 -
        this.x02 * this.x20 * this.x33 +
        this.x00 * this.x22 * this.x33) /
      d;
    m.x12 =
      (this.x03 * this.x12 * this.x30 -
        this.x02 * this.x13 * this.x30 -
        this.x03 * this.x10 * this.x32 +
        this.x00 * this.x13 * this.x32 +
        this.x02 * this.x10 * this.x33 -
        this.x00 * this.x12 * this.x33) /
      d;
    m.x13 =
      (this.x02 * this.x13 * this.x20 -
        this.x03 * this.x12 * this.x20 +
        this.x03 * this.x10 * this.x22 -
        this.x00 * this.x13 * this.x22 -
        this.x02 * this.x10 * this.x23 +
        this.x00 * this.x12 * this.x23) /
      d;
    m.x20 =
      (this.x11 * this.x23 * this.x30 -
        this.x13 * this.x21 * this.x30 +
        this.x13 * this.x20 * this.x31 -
        this.x10 * this.x23 * this.x31 -
        this.x11 * this.x20 * this.x33 +
        this.x10 * this.x21 * this.x33) /
      d;
    m.x21 =
      (this.x03 * this.x21 * this.x30 -
        this.x01 * this.x23 * this.x30 -
        this.x03 * this.x20 * this.x31 +
        this.x00 * this.x23 * this.x31 +
        this.x01 * this.x20 * this.x33 -
        this.x00 * this.x21 * this.x33) /
      d;
    m.x22 =
      (this.x01 * this.x13 * this.x30 -
        this.x03 * this.x11 * this.x30 +
        this.x03 * this.x10 * this.x31 -
        this.x00 * this.x13 * this.x31 -
        this.x01 * this.x10 * this.x33 +
        this.x00 * this.x11 * this.x33) /
      d;
    m.x23 =
      (this.x03 * this.x11 * this.x20 -
        this.x01 * this.x13 * this.x20 -
        this.x03 * this.x10 * this.x21 +
        this.x00 * this.x13 * this.x21 +
        this.x01 * this.x10 * this.x23 -
        this.x00 * this.x11 * this.x23) /
      d;
    m.x30 =
      (this.x12 * this.x21 * this.x30 -
        this.x11 * this.x22 * this.x30 -
        this.x12 * this.x20 * this.x31 +
        this.x10 * this.x22 * this.x31 +
        this.x11 * this.x20 * this.x32 -
        this.x10 * this.x21 * this.x32) /
      d;
    m.x31 =
      (this.x01 * this.x22 * this.x30 -
        this.x02 * this.x21 * this.x30 +
        this.x02 * this.x20 * this.x31 -
        this.x00 * this.x22 * this.x31 -
        this.x01 * this.x20 * this.x32 +
        this.x00 * this.x21 * this.x32) /
      d;
    m.x32 =
      (this.x02 * this.x11 * this.x30 -
        this.x01 * this.x12 * this.x30 -
        this.x02 * this.x10 * this.x31 +
        this.x00 * this.x12 * this.x31 +
        this.x01 * this.x10 * this.x32 -
        this.x00 * this.x11 * this.x32) /
      d;
    m.x33 =
      (this.x01 * this.x12 * this.x20 -
        this.x02 * this.x11 * this.x20 +
        this.x02 * this.x10 * this.x21 -
        this.x00 * this.x12 * this.x21 -
        this.x01 * this.x10 * this.x22 +
        this.x00 * this.x11 * this.x22) /
      d;
    return m;
  }
}

export function identity(): Matrix {
  return new Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
}

export function translate(v: Vector): Matrix {
  // prettier-ignore
  return new Matrix(
      1, 0, 0, v.x,
      0, 1, 0, v.y,
      0, 0, 1, v.z,
      0, 0, 0, 1);
}

export function scale(v: Vector): Matrix {
  // prettier-ignore
  return new Matrix(
      v.x, 0, 0, 0,
      0, v.y, 0, 0,
      0, 0, v.z, 0,
      0, 0, 0, 1);
}

export function rotate(vs: Vector, a: number): Matrix {
  let v = vs.normalize();
  let s = Math.sin(a);
  let c = Math.cos(a);
  let m = 1 - c;
  // prettier-ignore
  return new Matrix(
    m * v.x * v.x + c,m * v.x * v.y + v.z * s,m * v.z * v.x - v.y * s, 0,
    m * v.x * v.y - v.z * s, m * v.y * v.y + c, m * v.y * v.z + v.x * s, 0,
    m * v.z * v.x + v.y * s, m * v.y * v.z - v.x * s, m * v.z * v.z + c, 0,
    0, 0, 0, 1
  );
}

export function frustrum(
  l: number,
  r: number,
  b: number,
  t: number,
  n: number,
  f: number
): Matrix {
  let t1 = 2 * n;
  let t2 = r - l;
  let t3 = t - b;
  let t4 = f - n;
  // prettier-ignore
  return new Matrix(
		t1 / t2, 0, (r + l) / t2, 0,
		0, t1 / t3, (t + b) / t3, 0,
		0, 0, (-f - n) / t4, (-t1 * f) / t4,
		0, 0, -1, 0)
}

export function orthographic(
  l: number,
  r: number,
  b: number,
  t: number,
  n: number,
  f: number
): Matrix {
  // prettier-ignore
  return new Matrix(
      2 / (r - l), 0, 0, -(r + l) / (r - l),
      0, 2 / (t - b), 0, -(t + b) / (t - b),
      0, 0, -2 / (f - n), -(f + n) / (f - n),
      0, 0, 0, 1
    )
}

export function perspective(
  fovy: number,
  aspect: number,
  near: number,
  far: number
): Matrix {
  let ymax = near * Math.tan((fovy * Math.PI) / 360);
  let xmax = ymax * aspect;
  return frustrum(-xmax, xmax, -ymax, ymax, near, far);
}

export function lookAt(eye: Vector, center: Vector, _up: Vector): Matrix {
  let up = _up.normalize();
  let f = center.sub(eye).normalize();
  let s = f.cross(up).normalize();
  let u = s.cross(f).normalize();
  // prettier-ignore
  let m = new Matrix(
        s.x, u.x, -f.x, eye.x,
        s.y, u.y, -f.y, eye.y,
        s.z, u.z, -f.z, eye.z,
        0, 0, 0, 1,
  );
  return m.inverse();
}
