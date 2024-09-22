import { BinaryOperationInput } from "./generated/BinaryOperationInput";
import { CalculationOutput } from "./generated/CalculationOutput";

export function add(input: BinaryOperationInput): CalculationOutput {
  const result = input.a + input.b;
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
