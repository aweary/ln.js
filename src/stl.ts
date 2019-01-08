type float32arr = [number, number, number];

class STLTriangle {
  v1: float32arr;
  v2: float32arr;
  v3: float32arr;

  constructor(v1: float32arr, v2: float32arr, v3: float32arr) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
  }
}
