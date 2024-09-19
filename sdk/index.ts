import { TypedMap } from "./collections";

export class PluginInput {
  public content!: string;
  public timestampUnix!: i64;
  public user_id!: string | null;
}

export class PluginOutput {
  private name: string;
  private data: TypedMap<string, string>;
  private systemMessage: string | null;

  public constructor(name: string) {
    this.name = name;
    this.data = new TypedMap();
    this.systemMessage = null;
    this.assistantMessage = null;
  }

  public withData(key: string, value: string): PluginOutput {
    this.data.set(key, value);
    return this;
  }

  public withSystemMessage(message: string): PluginOutput {
    this.systemMessage = message;
    return this;
  }

  public withAssistantMessage(message: string): PluginOutput {
    this.assistantMessage = message;
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
