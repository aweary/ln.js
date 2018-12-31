import { ShapeT } from "./shape";
import Vector from "./vector";
import { Box } from "./box";
import Hit from "./hit";
import Ray from "./ray";
import { Paths } from "./paths";
export declare class Sphere implements ShapeT {
    center: Vector;
    radius: number;
    box: Box;
    constructor(center: Vector, radius: number);
    compile(): void;
    boundingBox(): Box;
    contains(v: Vector, f: number): boolean;
    intersect(r: Ray): Hit;
    paths(): Paths;
}
export declare class OutlineSphere extends Sphere {
    eye: Vector;
    up: Vector;
    constructor(eye: Vector, up: Vector, center: Vector, radius: number);
    paths(): Paths;
}
