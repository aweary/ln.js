import Ray from "./ray";
import { ShapeT } from "./shape";
import Vector from "./vector";
import { Axis } from "./axis";
export declare type PointPair = [number, number];
export declare class Box {
    min: Vector;
    max: Vector;
    constructor(min?: Vector, max?: Vector);
    anchor(anchor: Vector): Vector;
    center(): Vector;
    size(): Vector;
    contains(b: Vector): boolean;
    extend(b: Box): Box;
    intersect(r: Ray): [number, number];
    partition(axis: Axis, point: number): [boolean, boolean];
}
export declare function boxForShapes(shapes: Array<ShapeT>): Box;
