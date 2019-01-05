import { ShapeT } from "./shape";
import { Box, boxForShapes } from "./box";
import Triangle from "./triangle";
import { Tree } from "./tree";
import Vector from "./vector";
import Cube from "./cube";
import Ray from "./ray";
import Hit from "./hit";
import { Paths } from "./paths";
import { translate, identity } from "./matrix";
import Plane from "./plane";
import { HashSet } from "./set";
import { Matrix } from "./matrix";

export default class Mesh implements ShapeT {
  box: Box;
  triangles: Triangle[];
  tree: Tree;
  dirty: boolean;

  constructor(triangles: Triangle[]) {
    let box = boxForShapes(triangles);
    this.box = box;
    this.triangles = triangles;
    this.tree = new Tree(triangles);
    this.dirty = false;
  }

  compile() {
    if (this.dirty) {
      this.tree = new Tree(this.triangles);
      this.dirty = false;
    }
  }

  boundingBox(): Box {
    return this.box;
  }

  contains(v: Vector, f: number): boolean {
    return false;
  }

  intersect(r: Ray): Hit {
    let { tree } = this;
    if (tree === null) {
      throw new Error("Intersecting null tree in Mesh");
    }
    return tree.intersect(r);
  }

  paths(): Paths {
    let result: Paths = [];
    for (const t of this.triangles) {
      result.push(...t.paths());
    }
    return result;
  }

  updateBoundingBox(): void {
    this.box = boxForShapes(this.triangles);
  }

  unitCube(): void {
    this.fitInside(
      new Box(new Vector(0, 0, 0), new Vector(1, 1, 1)),
      new Vector(0, 0, 0)
    );
    this.moveTo(new Vector(0, 0, 0), new Vector(0.5, 0.5, 0.5));
  }

  moveTo(position: Vector, anchor: Vector): void {
    let matrix = translate(position.sub(this.box.anchor(anchor)));
    this.transform(matrix);
  }

  fitInside(box: Box, anchor: Vector): void {
    let scale = box
      .size()
      .div(this.boundingBox().size())
      .minComponent();
    let extra = box.size().sub(
      this.boundingBox()
        .size()
        .multiplyScalar(scale)
    );
    let matrix = identity();
    matrix = matrix.translate(this.boundingBox().min.multiplyScalar(-1));
    matrix = matrix.scale(new Vector(scale, scale, scale));
    matrix = matrix.translate(box.min.add(extra.mul(anchor)));
    this.transform(matrix);
  }

  transform(matrix: Matrix): void {
    for (const t of this.triangles) {
      t.v1 = matrix.mulPosition(t.v1);
      t.v2 = matrix.mulPosition(t.v2);
      t.v3 = matrix.mulPosition(t.v3);
      t.updateBoundingBox();
    }
    this.updateBoundingBox();
    this.dirty = true; // dirty
  }

  saveBinarySTL(path: string): Error {
    // TODO
    return new Error();
  }

  voxelize(size: number): Cube[] {
    let z1 = this.box.min.z;
    let z2 = this.box.max.z;
    let set: HashSet<Vector> = new HashSet();
    for (let z = z1; z <= z2; z += size) {
      let plane = new Plane(new Vector(0, 0, z), new Vector(0, 0, 1));
      let paths = plane.intersectMesh(this);
      for (const path of paths) {
        for (const v of path) {
          let x = Math.floor(v.x / size + 0.5) * size;
          let y = Math.floor(v.y / size + 0.5) * size;
          let z = Math.floor(v.z / size + 0.5) * size;
          const vec = new Vector(x, y, z);
          set.add(vec);
        }
      }
    }
    let result: Cube[] = [];
    set.forEach(v => {
      let cube = new Cube(v.subScalar(size / 2), v.addScalar(size / 2));
      result.push(cube);
    });
    return result;
  }
}
