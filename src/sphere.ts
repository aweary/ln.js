import { ShapeT } from "./shape";
import Vector from "./vector";
import { Box } from "./box";
import Hit, { NoHit } from "./hit";
import Ray from "./ray";
import { Paths } from "./paths";
import { Path } from "./path";
import { radians } from "./math";

export class Sphere implements ShapeT {
  center: Vector;
  radius: number;
  box: Box;
  constructor(center: Vector, radius: number) {
    let min = new Vector(
      center.x - radius,
      center.y - radius,
      center.z - radius
    );
    let max = new Vector(
      center.x + radius,
      center.y + radius,
      center.z + radius
    );
    let box = new Box(min, max);
    this.center = center;
    this.box = box;
    this.radius = radius;
  }

  compile() {
    // Noop
  }

  boundingBox() {
    return this.box;
  }

  contains(v: Vector, f: number): boolean {
    return v.sub(this.center).length() <= this.radius + f;
  }

  intersect(r: Ray): Hit {
    let radius = this.radius;
    let to = r.origin.sub(this.center);
    let b = to.dot(r.direction);
    let c = to.dot(to) - radius * radius;
    let d = b * b - c;
    if (d > 0) {
      d = Math.sqrt(d);
      let t1 = -b - d;
      if (t1 > 1e-2) {
        return new Hit(this, t1);
      }
      let t2 = -b + d;
      if (t2 > 1e-2) {
        return new Hit(this, t2);
      }
    }
    return NoHit;
  }

  paths(): Paths {
    var paths: Paths = [];
    let n = 10;
    let o = 10;
    for (let lat = -90 + o; lat <= 90 - o; lat += n) {
      var path: Path = [];
      for (let lng = 0; lng <= 360; lng++) {
        let v = latLngToXYZ(lat, lng, this.radius).add(this.center);
        path.push(v);
      }
      paths.push(path);
    }
    for (let lng = 0; lng <= 360; lng += n) {
      var path: Path = [];
      for (let lat = -90 + o; lat <= 90 - o; lat++) {
        let v = latLngToXYZ(lat, lng, this.radius).add(this.center);
        path.push(v);
      }
      paths.push(path);
    }
    return paths;
  }
}

export class OutlineSphere extends Sphere {
  eye: Vector;
  up: Vector;

  constructor(eye: Vector, up: Vector, center: Vector, radius: number) {
    super(center, radius);
    this.up = up;
    this.eye = eye;
  }

  paths(): Paths {
    var path: Path = [];
    let center = this.center;
    let radius = this.radius;

    let hyp = center.sub(this.eye).length();
    let opp = radius;
    let theta = Math.asin(opp / hyp);
    let adj = opp / Math.tan(theta);
    let d = Math.cos(theta) * adj;
    let r = Math.sin(theta) * adj;

    let w = center.sub(this.eye).normalize();
    let u = w.cross(this.up).normalize();
    let v = w.cross(u).normalize();
    let c = this.eye.add(w.multiplyScalar(d));
    for (let i = 0; i <= 360; i++) {
      let a = radians(i);
      let p = c;
      p = p.add(u.multiplyScalar(Math.cos(a) * r));
      p = p.add(v.multiplyScalar(Math.sin(a) * r));
      path.push(p);
    }
    return [path];
  }
}

function latLngToXYZ(lat: number, lng: number, radius: number): Vector {
  let latr = radians(lat);
  let lngr = radians(lng);
  let x = radius * Math.cos(latr) * Math.cos(lngr);
  let y = radius * Math.cos(latr) * Math.sin(lngr);
  let z = radius * Math.sin(latr);
  return new Vector(x, y, z);
}
