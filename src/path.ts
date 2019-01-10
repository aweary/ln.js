import Vector from "./vector";
import { Box } from "./box";
import { Matrix } from "./matrix";
import { FilterT } from "./filter";
import { Paths } from "./paths";

export type Path = Array<Vector>;

export function boundingBox(p: Path): Box {
  let box = new Box(p[0], p[0]);
  for (const path of p) {
    box = box.extend(new Box(path, path));
  }
  return box;
}

export function transform(p: Path, matrix: Matrix): Path {
  let result: Path = [];
  for (const path of p) {
    result.push(matrix.mulPosition(path));
  }
  return result;
}

export function chop(p: Path, step: number): Path {
  let result: Path = [];
  for (let i = 0; i < p.length - 1; i++) {
    let a = p[i];
    let b = p[i + 1];
    let v = b.sub(a);
    let l = v.length();
    if (i === 0) {
      result.push(a);
    }
    let d = step;
    while (d < l) {
      let p1 = a.add(v.multiplyScalar(d / l));
      result.push(p1);
      d += step;
    }
    result.push(b);
  }
  return result;
}

export function filterPaths(p: Path, f: FilterT): Paths {
  var result: Paths = [];
  let path: Path = [];
  for (const _v of p) {
    let [v, ok] = f.filter(_v);
    if (ok) {
      path = path.concat(v);
    } else {
      if (path.length > 1) {
        result.push(path);
      }
      // TODO what is this for?
      path = [];
    }
  }
  if (path.length > 1) {
    result.push(path);
  }
  return result;
}

export function simplify(p: Path, threshold: number): Path {
  if (p.length < 3) {
    return p;
  }
  let a = p[0];
  let b = p[p.length - 1];
  let index = -1;
  let distance = 0;
  for (let i = 1; i < p.length - 1; i++) {
    let d = p[i].segmentDistance(a, b);
    if (d > distance) {
      index = i;
      distance = d;
    }
  }
  if (distance > threshold) {
    let r1 = simplify(p.slice(0, index + 1), threshold);
    let r2 = simplify(p.slice(index), threshold);
    return [...r1, ...r2];
  } else {
    return [a, b];
  }
}

export function toSVG(p: Path): string {
  var coords: string[] = [];
  for (const path of p) {
    coords.push(`${ Math.round(path.x * 100) / 100 },${ Math.round(path.y * 100) / 100 }`);
  }
  let points = coords.join(" ");
  return `<polyline stroke="black" fill="none" points="${points}" />`;
}
