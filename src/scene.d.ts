import { ShapeT } from "./shape";
import { Tree } from "./tree";
import Ray from "./ray";
import Hit from "./hit";
import Vector from "./vector";
import { Paths as PathsT } from "./paths";
import { Matrix } from "./matrix";
export default class Scene {
    shapes: Array<ShapeT>;
    tree: null | Tree;
    constructor();
    compile(): void;
    add(shape: ShapeT): void;
    intersect(ray: Ray): Hit;
    visible(eye: Vector, point: Vector): boolean;
    paths(): PathsT;
    render(eye: Vector, center: Vector, up: Vector, width: number, height: number, fovy: number, near: number, far: number, step: number): PathsT;
    renderWithMatrix(matrix: Matrix, eye: Vector, width: number, height: number, step: number): PathsT;
}
