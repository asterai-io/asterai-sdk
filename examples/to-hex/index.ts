export * from "@asterai-io/sdk";
import {TypedMap} from "@asterai-io/sdk/collections";
import {parseInt} from "string";

export const FUNCTION_NAME: string = "convert number to hexadecimal";

export const FUNCTION_DESCRIPTION: string = "given an integer, convert it to a hexadecimal string";

export const FUNCTION_OUTPUT: string = "the hexadecimal string representation of the input integer";

export const FUNCTION_ARGUMENTS: string[] = ["number: required, integer"];

export function handleFunctionCall(arguments: TypedMap<string, string>): string {
  const number = arguments.get("number");
  if (!number) {
    return "error: no number argument received";
  }
  const parsed = parseInt(number);
  const hexString = parsed.toString(16);
  return `0x${hexString}`;
}

class FunctionArguments {
  constructor(
    public prefix: string,
    // The number.
    public number: f32,
  ) {}
}

export function handleFunctionCallTest(arguments: FunctionArguments): string {
  const hexString = arguments.number.toString(16);
  return `${arguments.prefix}${hexString}`;
}
