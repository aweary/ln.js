import Vector from "./vector";
import { Matrix } from "./matrix";
import Scene from "./scene";
import { Box } from "./box";
export interface FilterT {
    filter(v: Vector): [Vector, boolean];
}
export declare class ClipFilter implements FilterT {
    matrix: Matrix;
    eye: Vector;
    scene: Scene;
    constructor(matrix: Matrix, eye: Vector, scene: Scene);
    filter(v: Vector): [Vector, boolean];
}
export declare const ClipBox: Box;
