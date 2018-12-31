import Vector from "./vector";

export default class Ray {
  origin: Vector;
  direction: Vector;


  constructor(origin: Vector, direction: Vector) {
      this.origin = origin;
      this.direction = direction;
  }

  toString() {
    return `{Origin: ${this.origin}, Direction: ${this.direction}}`
  }

  position(t: number): Vector {
    return this.origin.add(this.direction.multiplyScalar(t));
  }
}
