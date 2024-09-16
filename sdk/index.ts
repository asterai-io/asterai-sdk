import { TypedMap } from "./collections";

export class PluginInput {
  public content: string;
  public timestampUnix: i64;

  public constructor(content: string, timestampUnix: i64) {
    this.content = content;
    this.timestampUnix = timestampUnix;
  }
}

export class PluginOutput {
  private name: string;
  private data: TypedMap<string, string>;
  private systemMessage: string | null;
  private assistantMessage: string | null;

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
// TODO use log namespace.
export declare function log_debug(msg: string): void;

export declare namespace host {
  export function http_request(request: string): string;
  export function semantic_search(request: TypedMap<string, string>): string;
}
