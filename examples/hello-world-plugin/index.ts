export * from "@asterai-io/sdk";
import {Message, PluginOutput} from "@asterai-io/sdk";

export function processMessage(input: Message): PluginOutput | null {
  return new PluginOutput("default").withAssistantMessage("Hello, world!");
}
