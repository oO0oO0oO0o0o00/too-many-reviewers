import { U } from "@/utils";

export interface HashableObject {
  get hashValue(): number;
}

export interface EquatableObject extends HashableObject {
  equalsTo(another: EquatableObject): boolean;
}

export function isHashableObject(arg: any): arg is HashableObject {
  return typeof U.lookupProperty(arg, 'hashValue') === 'function';
}

export function isEquatableObject(arg: any): arg is EquatableObject {
  return typeof arg.equalsTo === 'function';
}

type SupportedPrimitives = number | boolean | string | null | undefined;

type HashableElements = SupportedPrimitives | HashableObject;

export type Hashable = HashableElements | HashableElements[];

type EquatableElements = SupportedPrimitives | EquatableObject;

export type Equatable = EquatableElements | EquatableElements[];

export function Hashable$hashValue(x: any): number {
  const mask = 0x0fffffff;
  if (x == null) { return 0; }
  if (Array.isArray(x)) {
    let hash = 0;
    for (let e of x) {
      hash = (hash * 11 + Hashable$hashValue(e)) & mask;
    }
    return hash;
  }
  let assumedHash = x.hashValue;
  if (typeof assumedHash === 'number') { return assumedHash; }
  let hash = 0;
  switch (typeof x) {
    case 'number':
      return Number.isInteger(x) ? (x & mask) : new Int32Array(new Float64Array([x]).buffer)[0];
    case 'string':
      for (let i = 0; i < x.length; i++) {
        hash = (hash * 11 + x.charCodeAt(i)) & mask;
      }
      return hash;
    // Support others when encountered
    default:
      throw `type ${typeof x} cannot be hashed.`;
  }
}

export function Equatable$equalsTo(lhs: Equatable, rhs: Equatable) {
  if (Array.isArray(lhs)) {
    if (!Array.isArray(rhs) || lhs.length != rhs.length) { return false; }
    for (let i in lhs) {
      if (!Equatable$equalsTo(lhs[i], rhs[i])) { return false; }
    }
    return true;
  }
  if (isEquatableObject(lhs)) {
    if (!isEquatableObject(rhs)) { return false; }
    return lhs.equalsTo(rhs);
  }
  return lhs === rhs;
}
