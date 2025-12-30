function makeIntegerWithFloor(value: number) {
  return Math.floor(value);
}

export function range(start: number, end: number) {
  const endValue = makeIntegerWithFloor(end);
  const startValue = makeIntegerWithFloor(start);
  const result: number[] = [];
  for (let i = startValue; i <= endValue; i++) {
    result.push(i);
  }
  return result;
}
