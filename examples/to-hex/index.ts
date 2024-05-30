export * from "@asterai-io/sdk";
import {TypedMap} from "@asterai-io/sdk/collections";
import {parseInt} from "string";

export function convertDecimalToHex(arguments: TypedMap<string, string>): string {
  const decimal = arguments.get("decimal");
  if (!decimal) {
    return "error: no number argument received";
  }
  const parsed = parseInt(decimal);
  const hexString = parsed.toString(16);
  return `0x${hexString}`;
}
