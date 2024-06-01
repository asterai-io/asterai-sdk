// This module exports functions necessary for the host to communicate
// with the WASM module via AssemblyScript-specific interfaces.
import { PluginInput, PluginOutput } from "./index";
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
  String = 0,
  Message = 1,
  ArrayBuffer = 2,
  TypedMapStringString = 3,
  PluginOutput = 4,
  ArrayTypedMapEntryStringString = 5,
}

export function asc_id_of_type(typeId: TypeId): usize {
  switch (typeId) {
    case TypeId.String:
      return idof<string>();
    case TypeId.Message:
      return idof<PluginInput>();
    case TypeId.ArrayBuffer:
      return idof<ArrayBuffer>();
    case TypeId.TypedMapStringString:
      return idof<TypedMap<string, string>>();
    case TypeId.PluginOutput:
      return idof<PluginOutput>();
    case TypeId.ArrayTypedMapEntryStringString:
      return idof<Array<TypedMapEntry<string, string>>>();
  }
  throw new Error("unknown TypeId variant");
}
