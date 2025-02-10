import { Equatable, Equatable$equalsTo, Hashable$hashValue } from "./equatables";
import { Optional } from "./utils";

class KVP<K, V> {
  constructor(public key: K, public value: V) { }
}

export class OKMap<K extends Equatable, V> {
  private storage: Map<number, KVP<K, V>[]> = new Map();

  private _size: number = 0;

  public get size(): number {
    return this._size;
  }

  public get(key: K): V | undefined {
    let candidates = this.storage.get(Hashable$hashValue(key));
    if (candidates === undefined) { return undefined; }
    for (let candidate of candidates) {
      if (Equatable$equalsTo(candidate.key, key)) { return candidate.value; }
    }
    return undefined;
  }

  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  public set(key: K, value: V): Optional<V> {
    let candidates = this.storage.get(Hashable$hashValue(key)) ?? [];
    for (let candidate of candidates) {
      if (Equatable$equalsTo(candidate.key, key)) {
        let old = candidate.value;
        candidate.value = value;
        return old;
      }
    }
    candidates.push(new KVP(key, value));
    this.storage.set(Hashable$hashValue(key), candidates);
    this._size += 1;
    return undefined;
  }

  public delete(key: K): V | undefined {
    let candidates = this.storage.get(Hashable$hashValue(key));
    if (candidates === undefined) { return undefined; }
    let index = candidates.findIndex(
      (v) => Equatable$equalsTo(v.key, key));
    if (index < 0) { return undefined; }
    let value = candidates[index].value;
    candidates.splice(index, 1);
    this._size -= 1;
    return value;
  }
}
