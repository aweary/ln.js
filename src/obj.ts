import Mesh from "./mesh";
import Triangle from "./triangle";
import Vector from "./vector";

function parseIndex(value: string, length: number): number {
  let n = parseInt(value, 0);
  if (n < 0) {
    n += length;
  }
  return n;
}

/**
 * Parses Wavefront OBJ files
 * @param data raw .OBJ file data
 */
export function loadOBJ(data: string) {
  let lines = data.split("\n");
  // 1-based indexing
  let vs: Vector[] = [new Vector(0, 0, 0)];
  let triangles: Triangle[] = [];
  for (let line of lines) {
    let parts = line.split(" ");
    let keyword = parts[0];
    let args = parts.slice(1);
    switch (keyword) {
      case "v": {
        let f = args.map(a => parseFloat(a));
        let v = new Vector(f[0], f[1], f[2]);
        vs.push(v);
        break;
      }
      case "f": {
        let fvs: number[] = [];
        args.forEach((arg, i) => {
          let vertex = (arg + "//").split("/");
          fvs[i] = parseIndex(vertex[0], vs.length);
        });
        for (let i = 1; i < fvs.length - 1; i++) {
          let i1 = 0;
          let i2 = i;
          let i3 = i + 1;
          let t = new Triangle(vs[fvs[i1]], vs[fvs[i2]], vs[fvs[i3]]);
          triangles.push(t);
        }
      }
    }
  }
  return new Mesh(triangles);
}
