export function getRandom(number: number): number {
  const randomNum = Math.floor(Math.random() * number);
  return randomNum;
}
