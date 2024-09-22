import { Uint8Array } from "typedarray";

export declare namespace host {
  export function log(request: Uint8Array): void;
  export function http_request(request: Uint8Array): Uint8Array;
  export function semantic_search(request: Uint8Array): Uint8Array;
  export function kv_get_user_string(request: Uint8Array): Uint8Array;
  export function kv_set_user_string(request: Uint8Array): void;
}
