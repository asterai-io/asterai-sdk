import { TypedMap } from "./collections";

export class Context<Args extends TypedMap<string, string>> {
  private args!: Args;
  private query!: Query;
}

export class Query extends TypedMap<string, string> {
  public get content(): string {
    return this.mustGet("content");
  }

  public get userId(): string | null {
    return this.get("userId");
  }
}

export class Output {
  private data: TypedMap<string, string>;
  private systemMessage: string | null;
  private assistantMessage: string | null;

  public constructor() {
    this.data = new TypedMap();
    this.systemMessage = null;
    this.assistantMessage = null;
  }

  public withData(key: string, value: string): Output {
    this.data.set(key, value);
    return this;
  }

  public withSystemMessage(message: string): Output {
    this.systemMessage = message;
    return this;
  }

  public withAssistantMessage(message: string): Output {
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
}
