export function median(numbers: Array<number>): number {
  let median = 0;
  let count = numbers.length;
  if (count % 2 === 0) {
    median = (numbers[count / 2 - 1] + numbers[count / 2]) / 2;
  } else {
    median = numbers[(count - 1) / 2];
  }
  return median;
}
