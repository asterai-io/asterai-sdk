export * from "@asterai-io/sdk";
import {Message, PluginOutput} from "@asterai-io/sdk";

export function processMessage(input: Message): PluginOutput | null {
  return new PluginOutput("hello world plugin")
    .withData("isHelloWorldPlugin", "yes, it is!")
    .withAssistantMessage(`Hello, world! input: ${input.content}`);
}
