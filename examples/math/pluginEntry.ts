import { add } from "./plugin";
import { BinaryOperationArgs } from "./generated/BinaryOperationArgs";
import { Protobuf } from "as-proto";
import { CalculationResponse } from "./generated/CalculationResponse";

function getBufferFromPtr(ptr: u32): Uint8Array {
  const lengthBuffer = new Uint32Array(1);
  memory.copy(lengthBuffer.dataStart, ptr, 4);
  const length = lengthBuffer[0];
  const payloadBuffer = new Uint8Array(length);
  memory.copy(payloadBuffer.dataStart, ptr + 4, length);
  return payloadBuffer;
}

function getPtrFromBuffer(buffer: Uint8Array): u32 {
  const ptr = heap.alloc(buffer.length + 4);
  memory.copy(ptr, buffer.length, 4);
  memory.copy(ptr + 4, buffer.dataStart, buffer.length);
  return ptr;
}

export function addEntry(ptr: u32): u32 {
  const argsBuffer = getBufferFromPtr(ptr);
  const args = Protobuf.decode<BinaryOperationArgs>(
    argsBuffer,
    BinaryOperationArgs.decode,
  );
  const result = add(args);
  if (result == null) {
    return 0;
  }
  const resultBuffer = Protobuf.encode(result, CalculationResponse.encode);
  return getPtrFromBuffer(resultBuffer);
}

// repeat same as above for other stuff.
export function mul(args: BinaryOperationArgs): CalculationResponse {
  const result = args.a * args.b;
  return new CalculationResponse(result);
}

export function div(args: BinaryOperationArgs): CalculationResponse {
  const result = args.a / args.b;
  return new CalculationResponse(result);
}

export function pow(args: BinaryOperationArgs): CalculationResponse {
  const result = args.a ** args.b;
  return new CalculationResponse(result);
}
