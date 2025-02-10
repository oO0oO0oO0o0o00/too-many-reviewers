import { Equatable } from "./equatables";
import { OKMap } from "./ok_map";

export class OArraySet<T extends Equatable> {
  private i2e: Map<number, T> = new Map();
  private e2i: OKMap<T, number> = new OKMap();

  constructor(array?: T[]) {
    array?.forEach((element, index) => {
      this.i2e.set(index, element);
      this.e2i.set(element, index);
    });
  }

  public get size(): number {
    return this.i2e.size;
  }

  public get(i: number): T | undefined {
    return this.i2e.get(i);
  }

  public add(e: T) {
    if (this.has(e)) { return; }
    let i = this.i2e.size;
    this.e2i.set(e, i);
    this.i2e.set(i, e);
  }

  public has(e: T): boolean {
    return this.e2i.get(e) !== undefined;
  }

  public delete(e: T): boolean {
    let i = this.e2i.delete(e);
    if (i === undefined) { return false; }
    this.i2e.delete(i);
    let im = this.i2e.size;
    let em = this.i2e.get(im);
    if (em === undefined) { return true; }
    this.i2e.delete(im);
    this.e2i.delete(em);
    this.i2e.set(i, em);
    this.e2i.set(em, i);
    return true;
  }

  public random(): T | undefined {
    let size = this.i2e.size;
    if (size == 0) { return undefined; }
    return this.i2e.get(Math.floor(Math.random() * size));
  }

  public copy(): ThisType<T> {
    let copied = new OArraySet<T>();
    this.i2e.forEach(v => copied.add(v));
    return copied;
  }

  public randomChoicesNoReplace(n: number): T[] {
      const result: T[] = [];
      const indices = new Map(this.i2e);
      for (let i = 0; i < n; i++) {
        let index = Math.floor(Math.random() * indices.size);
        const next = indices.get(index);
        if (next === undefined) { break; }
        indices.delete(index);
        result.push(next);
      }
      return result;
  }
}
