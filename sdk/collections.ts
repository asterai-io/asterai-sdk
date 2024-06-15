import { parseInt, parseFloat } from "string";

/**
 * TypedMap entry.
 */
export class TypedMapEntry<K, V> {
  key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

/** Typed map */
export class TypedMap<K, V> {
  entries: Array<TypedMapEntry<K, V>>;

  constructor() {
    this.entries = new Array<TypedMapEntry<K, V>>(0);
    // this.entries = []
  }

  set(key: K, value: V): void {
    const entry = this.getEntry(key);
    if (entry === null) {
      const entry = new TypedMapEntry<K, V>(key, value);
      this.entries.push(entry);
    } else {
      entry.value = value;
    }
  }

  getEntry(key: K): TypedMapEntry<K, V> | null {
    for (let i: i32 = 0; i < this.entries.length; i++) {
      if (this.entries[i].key == key) {
        return this.entries[i];
      }
    }
    return null;
  }

  mustGetEntry(key: K): TypedMapEntry<K, V> {
    const entry = this.getEntry(key);
    assert(entry != null, `Entry for key ${key} does not exist in TypedMap`);
    return entry!;
  }

  get(key: K): V | null {
    for (let i: i32 = 0; i < this.entries.length; i++) {
      if (this.entries[i].key == key) {
        return this.entries[i].value;
      }
    }
    return null;
  }

  mustGet(key: K): V {
    const value = this.get(key);
    assert(value != null, `Value for key ${key} does not exist in TypedMap`);
    return value!;
  }

  isSet(key: K): bool {
    for (let i: i32 = 0; i < this.entries.length; i++) {
      if (this.entries[i].key == key) {
        return true;
      }
    }
    return false;
  }
}

export function parseTypeFromString<T>(value: string, typeName: string): T {
  const isInt =
    typeName == "i8" ||
    typeName == "u8" ||
    typeName == "i16" ||
    typeName == "u16" ||
    typeName == "i32" ||
    typeName == "u32" ||
    typeName == "i64" ||
    typeName == "u64" ||
    typeName == "isize" ||
    typeName == "usize";
  if (isInt) {
    return parseInt(value) as T;
  }
  const isFloat = typeName == "f32" || typeName == "f64";
  if (isFloat) {
    return parseFloat(value) as T;
  }
  if (typeName == "bool") {
    return (value.toLowerCase() == "true") as T;
  }
  throw new Error("invalid type name");
}
