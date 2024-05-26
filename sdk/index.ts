export * from "./interface_exports";

export class Message {
  public content: string;
  public timestampUnix: i64;

  public constructor(content: string, timestampUnix: i64) {
    this.content = content;
    this.timestampUnix = timestampUnix;
  }
}

export class PluginOutput {
  private name: string;
  private data: Map<string, string> | null;
  private systemMessage: string | null;
  private assistantMessage: string | null;

  public constructor(name: string) {
    this.name = name;
    this.data = null;
    this.systemMessage = null;
    this.assistantMessage = null;
  }

  public withData(key: string, value: string): PluginOutput {
    if (!this.data) {
      this.data = new Map();
    }
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
