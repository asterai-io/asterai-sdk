import { TypedMap } from "./collections";

export class PluginInput {
  public content!: string;
  public timestampUnix!: i64;
  public user_id!: string | null;
}

export class Output {
  private data: TypedMap<string, string>;
  private systemMessage: string | null;

  public constructor() {
    this.data = new TypedMap();
    this.systemMessage = null;
  }

  public withData(key: string, value: string): Output {
    this.data.set(key, value);
    return this;
  }

  public withSystemMessage(message: string): Output {
    this.systemMessage = message;
    return this;
  }
}

// Host interface for logging.
export declare namespace log {
  export function debug(msg: string): void;
}

export declare namespace host {
  export function http_request(request: string): string;
  export function semantic_search(request: TypedMap<string, string>): string;
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
