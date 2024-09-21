// Host interface for logging.
export declare namespace log {
  export function debug(msg: string): void;
}

export declare namespace host {
  export function http_request(request: string): string;
  // TODO: implement return type of Uint8Array.
  export function semantic_search(request: Uint8Array): string;
  export function kv_get_user_string(
    userId: string,
    key: string,
  ): string | null;
  export function kv_set_user_string(
    userId: string,
    key: string,
    value: string | null,
  ): void;
}
