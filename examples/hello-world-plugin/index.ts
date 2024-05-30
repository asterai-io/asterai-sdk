export * from "@asterai-io/sdk";
import {PluginInput, PluginOutput} from "@asterai-io/sdk";

export function processMessage(input: PluginInput): PluginOutput | null {
  return new PluginOutput("hello world plugin")
    .withData("isHelloWorldPlugin", "yes, it is!")
    .withAssistantMessage(`Hello, world! input: ${input.content}`);
}
