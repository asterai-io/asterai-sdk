import { BinaryOperationInput } from "./generated/BinaryOperationInput";
import { CalculationOutput } from "./generated/CalculationOutput";
import { Protobuf } from "@asterai/as-proto/assembly";
export * from "@asterai/sdk/exports";

export function add(inputBuffer: Uint8Array): Uint8Array {
  const input = Protobuf.decode<BinaryOperationInput>(
    inputBuffer,
    BinaryOperationInput.decode,
  );
  const result = input.a + input.b;
  return Protobuf.encode<CalculationOutput>(
    new CalculationOutput(result),
    CalculationOutput.encode,
  );
}

export function mul(input: BinaryOperationInput): CalculationOutput {
  const result = input.a * input.b;
  return new CalculationOutput(result);
}

export function div(input: BinaryOperationInput): CalculationOutput {
  const result = input.a / input.b;
  return new CalculationOutput(result);
}

export function pow(input: BinaryOperationInput): CalculationOutput {
  const result = input.a ** input.b;
  return new CalculationOutput(result);
}
