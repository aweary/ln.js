import {Box} from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit from "./hit";
import {Paths} from "./paths";
import { Matrix } from "./matrix";


export interface ShapeT {
    compile() : void;
    boundingBox(): Box;
    contains(v: Vector, point: number) : boolean;
    intersect(r: Ray) : Hit;
    paths(): Paths;
}

// export class TransformedShape implements ShapeT {
//     shape: ShapeT;
//     matrix: Matrix;
//     inverse: Matrix;
// }