import { Box } from "./box";
import Ray from "./ray";
import Hit from "./hit";
import { ShapeT } from "./shape";
import { Axis } from "./axis";
export declare class Tree {
    box: Box;
    root: Node;
    constructor(shapes: Array<ShapeT>);
    intersect(r: Ray): Hit;
}
export declare class Node {
    axis: Axis;
    point: number;
    shapes: Array<ShapeT>;
    left: Node;
    right: Node;
    constructor(shapes: Array<ShapeT>);
    intersect(r: Ray, tmin: number, tmax: number): Hit;
    intersectShapes(r: Ray): Hit;
    partitionScore(axis: Axis, point: number): number;
    partition(size: number, axis: Axis, point: number): [Array<ShapeT>, Array<ShapeT>];
    split(depth: number): void;
}
