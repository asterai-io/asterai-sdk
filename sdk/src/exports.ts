// This module exports functions necessary for the host to communicate
// with the WASM module via AssemblyScript-specific interfaces.
import { Context, Output } from "./index";
import { ArrayBuffer } from "arraybuffer";
import { TypedMap, TypedMapEntry } from "./collections";

// TODO: remove this so it's broken and ensure asterai API handles it gracefully.
export function allocate(size: usize): usize {
  return heap.alloc(size);
}

export function deallocate(ptr: usize): void {
  heap.free(ptr);
}

export enum TypeId {
  // Base types from 0..=10000.
  String = 0,
  ArrayBuffer = 1,
  ArrayTypedMapEntryStringString = 2,
  TypedMapStringString = 3,
  // Asterai types from 10001.
  Context = 10001,
  Output = 10002,
}

export function asc_id_of_type(typeId: TypeId): usize {
  switch (typeId) {
    case TypeId.String:
      return idof<string>();
    case TypeId.ArrayBuffer:
      return idof<ArrayBuffer>();
    case TypeId.ArrayTypedMapEntryStringString:
      return idof<Array<TypedMapEntry<string, string>>>();
    case TypeId.TypedMapStringString:
      return idof<TypedMap<string, string>>();
    case TypeId.Context:
      return idof<Context<TypedMap<string, string>>>();
    case TypeId.Output:
      return idof<Output>();
  }
  throw new Error("unknown TypeId variant");
}
