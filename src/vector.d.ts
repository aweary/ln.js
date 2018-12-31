export default class Vector {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    toString(): string;
    length(): number;
    distance(b: Vector): number;
    lengthSquared(): number;
    distanceSquared(b: Vector): number;
    dot(b: Vector): number;
    cross(b: Vector): Vector;
    normalize(): Vector;
    add(b: Vector): Vector;
    sub(b: Vector): Vector;
    mul(b: Vector): Vector;
    div(b: Vector): Vector;
    addScalar(b: number): Vector;
    subScalar(b: number): Vector;
    multiplyScalar(b: number): Vector;
    divScalar(b: number): Vector;
    min(b: Vector): Vector;
    max(b: Vector): Vector;
    minAxis(): Vector;
    minComponent(): number;
    segmentDistance(v: Vector, w: Vector): number;
}
