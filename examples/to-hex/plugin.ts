import { ToHexRequest } from "./generated/ToHexRequest";
import { ToHexResponse } from "./generated/ToHexResponse";
import { Log } from "@asterai/sdk"

export function convertDecimalToHex(args: ToHexRequest): ToHexResponse {
  Log.debug(`Converting decimal to hex: ${args.decimal}`);

  const hexString = args.decimal.toString(16);
  return new ToHexResponse(`0x${hexString}.`);
}
