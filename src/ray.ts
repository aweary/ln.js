import Vector from "./vector";

export default class Ray {
  origin: Vector;
  direction: Vector;

  constructor(origin: Vector, direction: Vector) {
      this.origin = origin;
      this.direction = direction;
  }

  position(t: number): Vector {
    return this.origin.add(this.direction.mulScalar(t));
  }
}
