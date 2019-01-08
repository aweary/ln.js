import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit, { NoHit } from "./hit";
import { Paths as PathsT } from "./paths";
import * as Paths from "./paths";
import { Matrix } from "./matrix";

export interface ShapeT {
  compile(): void;
  boundingBox(): Box;
  contains(v: Vector, point: number): boolean;
  intersect(r: Ray): Hit;
  paths(): PathsT;
}

export class TransformedShape implements ShapeT {
  shape: ShapeT;
  matrix: Matrix;
  inverse: Matrix;
  constructor(shape: ShapeT, matrix: Matrix) {
    this.shape = shape;
    this.matrix = matrix;
    this.inverse = matrix.inverse();
  }

  compile() {
    this.shape.compile();
  }

  boundingBox(): Box {
    return this.matrix.mulBox(this.shape.boundingBox());
  }

  contains(v: Vector, f: number): boolean {
    return this.shape.contains(this.inverse.mulPosition(v), f);
  }

  intersect(r: Ray): Hit {
    return this.shape.intersect(this.inverse.mulRay(r));
  }

  paths(): PathsT {
    let paths = this.shape.paths();
    return Paths.transform(paths, this.matrix);
  }
}

export class EmptyShape implements ShapeT {
  compile() {
    // noop
  }
  boundingBox() {
    let min = new Vector(0, 0, 0);
    let max = new Vector(0, 0, 0);
    return new Box(min, max);
  }

  contains(v: Vector, f: number): boolean {
    return false;
  }

  intersect(r: Ray): Hit {
    return NoHit;
  }

  paths() {
    return [];
  }
}
