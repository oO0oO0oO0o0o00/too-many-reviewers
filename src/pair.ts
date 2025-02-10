import { EquatableObject, Hashable$hashValue } from "./equatables";

export class Pair<T, U> implements EquatableObject {
  constructor(public first: T, public second: U) {}

  equalsTo(another: EquatableObject): boolean {
    if (another instanceof Pair) {
      return this.first === another.first && this.second === another.second;
    }
    return false;
  }
  
  get hashValue(): number {
    return Hashable$hashValue(this.first) * 11 + Hashable$hashValue(this.second);
  }
}

export type Pos = Pair<number, number>;

export const Pos$fourDirections: Pos[] = [
  new Pair(-1, 0),
  new Pair(0, 1),
  new Pair(1, 0),
  new Pair(0, -1),
];

export function Pos$add(lhs: Pos, rhs: Pos) {
  return new Pair(lhs.first + rhs.first, lhs.second + rhs.second);
}
