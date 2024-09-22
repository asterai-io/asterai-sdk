import { BinaryOperationInput } from "./generated/BinaryOperationInput";
import { CalculationOutput } from "./generated/CalculationOutput";
import { Protobuf } from "@asterai/as-proto/assembly";
import { readBufferFromPtr, writeBufferToPr } from "@asterai/sdk/protobuf";
export * from "@asterai/sdk/exports";

export function add(ptr: u32): u32 {
  const inputBuffer = readBufferFromPtr(ptr);
  const input = Protobuf.decode<BinaryOperationInput>(
    inputBuffer,
    BinaryOperationInput.decode,
  );
  const result = input.a + input.b;
  const outputBuffer = Protobuf.encode<CalculationOutput>(
    new CalculationOutput(`the result is ${result}`),
    CalculationOutput.encode,
  );
  return writeBufferToPr(outputBuffer);
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
