import { Box } from "./box";
import { FilterT } from "./filter";
import { Matrix } from "./matrix";
import { Path as PathT } from "./path";
import * as Path from "./path";

export type Paths = Array<PathT>;

export function boundingBox(p: Paths): Box {
  let box = Path.boundingBox(p[0]);
  for (const path of p) {
    box = box.extend(Path.boundingBox(path));
  }
  return box;
}

export function transform(p: Paths, matrix: Matrix): Paths {
  let result: Paths = [];
  for (const path of p) {
    result.push(Path.transform(path, matrix));
  }
  return result;
}

export function chop(p: Paths, step: number): Paths {
  var result = [];
  for (const path of p) {
    result.push(Path.chop(path, step));
  }
  return result;
}

export function filterPaths(p: Paths, f: FilterT): Paths {
  var result = [];
  for (const path of p) {
    result.push(...Path.filterPaths(path, f));
  }
  return result;
}

export function simplify(p: Paths, threshold: number): Paths {
  var result = [];
  for (const path of p) {
    result.push(Path.simplify(path, threshold));
  }
  return result;
}

export function toSVG(p: Paths, width: number, height: number): string {
  let lines: string[] = [];
  lines.push(
    `<svg width="${width}" height="${height}" version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">`
  );
  lines.push(`<g transform="translate(0,${height}) scale(1,-1)">`);
  for (const path of p) {
    lines.push(Path.toSVG(path));
  }
  lines.push(`</g></svg>`);
  return lines.join("\n");
}
