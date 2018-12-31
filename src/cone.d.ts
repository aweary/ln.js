import { ShapeT } from "./shape";
import { Box } from "./box";
import Vector from "./vector";
import Ray from "./ray";
import Hit from "./hit";
import { Paths } from "./paths";
export default class Cone implements ShapeT {
    radius: number;
    height: number;
    constructor(radius: number, height: number);
    compile(): void;
    boundingBox(): Box;
    contains(v: Vector, f: number): boolean;
    intersect(ray: Ray): Hit;
    paths(): Paths;
}
