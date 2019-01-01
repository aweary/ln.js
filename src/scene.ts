import { ShapeT } from "./shape";
import { Tree } from "./tree";
import Ray from "./ray";
import Hit from "./hit";
import Vector from "./vector";
import { Paths as PathsT } from "./paths";
import * as Paths from "./paths";
import { lookAt, Matrix, translate } from "./matrix";
import { ClipFilter } from "./filter";

export default class Scene {
  shapes: Array<ShapeT>;
  tree: Tree;

  constructor() {
    this.shapes = [];
    this.tree = new Tree(this.shapes);
  }

  compile() {
    for (const shape of this.shapes) {
      shape.compile();
    }
    this.tree = new Tree(this.shapes);
  }

  add(shape: ShapeT) {
    this.shapes.push(shape);
  }

  intersect(ray: Ray): Hit {
    return this.tree.intersect(ray);
  }

  visible(eye: Vector, point: Vector): boolean {
    const v = eye.sub(point);
    const r = new Ray(point, v.normalize());
    const hit = this.intersect(r);
    return hit.t >= v.length();
  }

  paths(): PathsT {
    let results: PathsT = [];
    for (const shape of this.shapes) {
      let shapePaths = shape.paths();
      shapePaths.forEach(p => results.push(p));
    }
    return results;
  }

  render(
    eye: Vector,
    center: Vector,
    up: Vector,
    width: number,
    height: number,
    fovy: number,
    near: number,
    far: number,
    step: number
  ): PathsT {
    let aspect = width / height;
    let matrix = lookAt(eye, center, up);
    matrix = matrix.perspective(fovy, aspect, near, far);
    return this.renderWithMatrix(matrix, eye, width, height, step);
  }

  renderWithMatrix(
    matrix: Matrix,
    eye: Vector,
    width: number,
    height: number,
    step: number
  ): PathsT {
    this.compile();
    let paths = this.paths();
    if (step > 0) {
      paths = Paths.chop(paths, step);
    }
    let f = new ClipFilter(matrix, eye, this);
    // We're always filtering the same paths?
    paths = Paths.filterPaths(paths, f);
    if (step > 0) {
      paths = Paths.simplify(paths, 1e-6);
    }
    let matrix2 = translate(new Vector(1, 1, 0)).scale(
      new Vector(width / 2, height / 2, 0)
    );
    return Paths.transform(paths, matrix2);
  }
}
