import Vector from "./vector";
export default class Ray {
    origin: Vector;
    direction: Vector;
    constructor(origin: Vector, direction: Vector);
    toString(): string;
    position(t: number): Vector;
}
