// This module exports functions necessary for the host to communicate
// with the WASM module via AssemblyScript-specific interfaces.
import {Message} from "./index";

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
}

export function asc_id_of_type(typeId: TypeId): usize {
  switch (typeId) {
    case TypeId.String:
      return idof<string>();
    case TypeId.Message:
      return idof<Message>();
  }
  throw new Error("unknown TypeId variant");
}
