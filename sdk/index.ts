import { writeBufferToPr } from "./buffer";
import { Protobuf } from "@asterai/as-proto/assembly";
import { HostLogRequest } from "./generated/HostLogRequest";

declare namespace host {
  export function log(request: u32): void;
  export function http_request(request: u32): u32;
  export function semantic_search(request: u32): u32;
  export function kv_get_user_string(request: u32): u32;
  export function kv_set_user_string(request: u32): void;
}

export class Log {
  public static trace(content: string) {
    Log.level(content, "trace");
  }

  public static debug(content: string) {
    Log.level(content, "debug");
  }

  public static info(content: string) {
    Log.level(content, "info");
  }

  public static warn(content: string) {
    Log.level(content, "warn");
  }

  public static error(content: string) {
    Log.level(content, "error");
  }

  static level(content: string, level: string) {
    const request = new HostLogRequest(content, level);
    const encoded = Protobuf.encode<HostLogRequest>(
      request,
      HostLogRequest.encode,
    );
    host.log(writeBufferToPr(encoded));
  }
}
