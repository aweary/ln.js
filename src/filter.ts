import Vector from "./vector";
import { Matrix } from "./matrix";
import Scene from "./scene";
import { Box } from "./box";

export interface FilterT {
  filter(v: Vector): [Vector, boolean];
}

export class ClipFilter implements FilterT {
  matrix: Matrix;
  eye: Vector;
  scene: Scene;
  constructor(matrix: Matrix, eye: Vector, scene: Scene) {
    this.matrix = matrix;
    this.eye = eye;
    this.scene = scene;
  }

  filter(v: Vector): [Vector, boolean] {
    let w = this.matrix.mulPositionW(v);
    if (!this.scene.visible(this.eye, v)) {
      return [w, false];
    }
    if (!ClipBox.contains(w)) {
      return [w, false];
    }
    return [w, true];
  }
}

export const ClipBox = new Box(new Vector(-1, -1, -1), new Vector(1, 1, 1));
