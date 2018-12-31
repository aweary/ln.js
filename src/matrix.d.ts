import Vector from "./vector";
import Ray from "./ray";
import { Box } from "./box";
/**
 * lol this is terrible
 */
export declare class Matrix {
    x00: number;
    x01: number;
    x02: number;
    x03: number;
    x10: number;
    x11: number;
    x12: number;
    x13: number;
    x20: number;
    x21: number;
    x22: number;
    x23: number;
    x30: number;
    x31: number;
    x32: number;
    x33: number;
    constructor(x00?: number, x01?: number, x02?: number, x03?: number, x10?: number, x11?: number, x12?: number, x13?: number, x20?: number, x21?: number, x22?: number, x23?: number, x30?: number, x31?: number, x32?: number, x33?: number);
    translate(v: Vector): Matrix;
    scale(v: Vector): Matrix;
    rotate(v: Vector, a: number): Matrix;
    frustrum(l: number, r: number, b: number, t: number, n: number, f: number): Matrix;
    orthographic(l: number, r: number, b: number, t: number, n: number, f: number): Matrix;
    perspective(fovy: number, aspect: number, near: number, far: number): Matrix;
    mul(b: Matrix): Matrix;
    mulPosition(b: Vector): Vector;
    mulPositionW(b: Vector): Vector;
    mulDirection(b: Vector): Vector;
    mulRay(b: Ray): Ray;
    mulBox(box: Box): Box;
    transpose(): Matrix;
    determinant(): number;
    inverse(): Matrix;
}
export declare function createIdentityMatrix(): Matrix;
export declare function createTranslateMatrix(v: Vector): Matrix;
export declare function createScaleMatrix(v: Vector): Matrix;
export declare function rotate(vs: Vector, a: number): Matrix;
export declare function frustrum(l: number, r: number, b: number, t: number, n: number, f: number): Matrix;
export declare function orthographic(l: number, r: number, b: number, t: number, n: number, f: number): Matrix;
export declare function perspective(fovy: number, aspect: number, near: number, far: number): Matrix;
export declare function lookAt(eye: Vector, center: Vector, _up: Vector): Matrix;
