// export function median(numbers: Float64Array): number {
//   let median = 0;
//   let count = numbers.length;
//   if (count % 2 === 0) {
//     median = (numbers[count / 2 - 1] | (0 + numbers[count / 2]) | 0) / 2;
//   } else {
//     median = numbers[(count - 1) | (0 / 2)];
//   }
//   return median;
// }

export function median(items: Float64Array): number {
  let n = items.length;
  if (n === 0) {
    return 0;
  }
  if (n % 2 === 1) {
    return items[n / 2];
  }
  let a = items[n / 2 - 1];
  let b = items[n / 2];
  return (a + b) / 2;
}

export function lerp(min: number, max: number, t: number): number {
  return min * (1 - t) + max * t;
}

export function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
