export * from "@asterai/sdk";
import { PluginInput, PluginOutput } from "@asterai/sdk";

export function processMessage(input: PluginInput): PluginOutput | null {
  return new PluginOutput("hello world plugin")
    .withData("isHelloWorldPlugin", "yes, it is!")
    .withAssistantMessage(`Hello, world! input: ${input.content}`);
}
