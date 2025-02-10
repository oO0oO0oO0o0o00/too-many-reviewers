export class SimpleCache<K, V> {
  private cache: Map<K, V> = new Map();
  
  constructor(private fn: (key: K) => V) { }
  
  get(key: K): V {
    let cached = this.cache.get(key);
    if (cached !== undefined) { return cached; }
    let value = this.fn(key);
    this.cache.set(key, value);
    return value;
  }
}
