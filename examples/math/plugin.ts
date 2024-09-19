import { BinaryOperationArgs } from "./generated/BinaryOperationArgs";
import { CalculationResponse } from "./generated/CalculationResponse";
export * from "@asterai/sdk/exports";

export function add(args: BinaryOperationArgs): CalculationResponse {
  const result = args.a + args.b;
  return new CalculationResponse(result);
}

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
