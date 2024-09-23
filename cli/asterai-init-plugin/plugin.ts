import { BinaryOperationInput } from "./generated/BinaryOperationInput";
import { CalculationOutput } from "./generated/CalculationOutput";
import { PluginContext } from "./generated/PluginContext";
import { ProcessQueryOutput } from "./generated/ProcessQueryOutput";
import { Log } from "@asterai/sdk";

export function processQuery(input: PluginContext): ProcessQueryOutput {
  Log.info(`math plugin received a query: ${input.query.content}`);
  // This doesn't return any data, but protobuf requires functions
  // to always have one input and one output exactly to ensure
  // backward compatibility.
  return new ProcessQueryOutput();
}

export function add(input: BinaryOperationInput): CalculationOutput {
  const result = input.a + input.b;
  // CalculationOutput returns a system message.
  // The `system_message` field is sent to the LLM.
  return new CalculationOutput(`the result is ${result}`);
}

export function mul(input: BinaryOperationInput): CalculationOutput {
  const result = input.a * input.b;
  return new CalculationOutput(`the result is ${result}`);
}

export function div(input: BinaryOperationInput): CalculationOutput {
  const result = input.a / input.b;
  return new CalculationOutput(`the result is ${result}`);
}

export function pow(input: BinaryOperationInput): CalculationOutput {
  const result = input.a ** input.b;
  return new CalculationOutput(`the result is ${result}`);
}
