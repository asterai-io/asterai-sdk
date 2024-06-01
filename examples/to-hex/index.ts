import { ConvertDecimalToHexArgs } from "./generated/ConvertDecimalToHexArgs";
export * from "@asterai-io/sdk";

export function convertDecimalToHex(args: ConvertDecimalToHexArgs): string {
  const hexString = args.integer.toString(16);
  return `0x${hexString}`;
}
