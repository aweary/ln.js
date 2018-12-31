import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit from "./hit";
import { Paths as PathsT } from "./paths";
import { Matrix } from "./matrix";
export interface ShapeT {
    compile(): void;
    boundingBox(): Box;
    contains(v: Vector, point: number): boolean;
    intersect(r: Ray): Hit;
    paths(): PathsT;
}
export declare class TransformedShape implements ShapeT {
    shape: ShapeT;
    matrix: Matrix;
    inverse: Matrix;
    constructor(shape: ShapeT, matrix: Matrix);
    compile(): void;
    boundingBox(): Box;
    contains(v: Vector, f: number): boolean;
    intersect(r: Ray): Hit;
    paths(): PathsT;
}
