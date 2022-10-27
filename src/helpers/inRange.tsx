export function inRange(x: number, min: number, max: number) {
  return (x - min) * (x - max) <= 0;
}
