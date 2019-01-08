import { ShapeT } from "./shape";

export default class Hit {
  shape: null | ShapeT;
  t: number;

  constructor(shape: null | ShapeT, t: number) {
    this.shape = shape;
    this.t = t;
  }

  ok(): boolean {
    return this.t < 1e9;
  }

  min(b: Hit): Hit {
    if (this.t <= b.t) {
      return this;
    }
    return b;
  }
  
  max(b: Hit): Hit {
    if (this.t > b.t) {
      return this;
    }
    return b;
  }
}

export const NoHit = new Hit(null, 1e9);
