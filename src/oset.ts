import { Equatable } from "./equatables";
import { OKMap } from "./ok_map";

export class OSet<T extends Equatable> {
  private storage: OKMap<T, boolean> = new OKMap();

  public constructor(arr?: T[]) {
    for (let e of arr ?? []) {
      this.storage.set(e, true);
    }
  }

  public get size(): number {
    return this.storage.size;
  }

  public has(value: T): boolean {
    return this.storage.has(value);
  }

  public add(value: T): boolean {
    return this.storage.set(value, true) === undefined;
  }

  public intersection(another: Iterable<T>): OSet<T> {
    let result = new OSet<T>();
    for (let e of another) {
      if (this.has(e)) { result.add(e); }
    }
    return result;
  }
}

