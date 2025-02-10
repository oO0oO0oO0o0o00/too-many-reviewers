export type Optional<T> = T | undefined;

export class U {
  static randomInt(a: number, b?: number): number {
    let r = Math.random();
    if (b != undefined) {
      return Math.floor(r * (b - a)) + a;
    }
    return Math.floor(r * a);
  }

  static randomSelect<T>(arr: T[]): Optional<T> {
    if (arr.length == 0) { return undefined; }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static randomChar(arr: string): Optional<string> {
    if (arr.length == 0) { return undefined; }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static lookupProperty(o: any, name: string | number): Optional<PropertyDescriptor> {
    if (typeof o !== 'object') { return undefined; }
    let current = o;
    while (current) {
      let prop = Object.getOwnPropertyDescriptor(o, name);
      if (prop) { return prop; }
      current = current.__proto__;
    }
  }
}
