import Vector from "./vector";
import { Box } from "./box";
import { ShapeT } from "./shape";
import Hit from "./hit";
import Ray from "./ray";
import { Paths } from "./paths";
export default class Cube implements ShapeT {
    min: Vector;
    max: Vector;
    box: Box;
    constructor(min: Vector, max: Vector);
    compile(): void;
    boundingBox(): Box;
    contains(v: Vector, f: number): boolean;
    intersect(r: Ray): Hit;
    paths(): Paths;
}
