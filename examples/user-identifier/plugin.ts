import { PluginInput, PluginOutput } from "@asterai/sdk";
import { IdentifyUserArgs } from "./generated/IdentifyUserArgs";
export * from "@asterai/sdk/exports";

// TODO: improve this. It is an early experiment and not meant for production.
let inputCache: PluginInput | null = null;

export function processMessage(input: PluginInput): PluginOutput | null {
  inputCache = input;
  return null;
}

export function identifyUser(_: IdentifyUserArgs): string {
  if (inputCache == null) {
    return "input cache is null. something went wrong.";
  }
  if (inputCache!.user_id == null) {
    return "user is not logged in, no user id found";
  }
  let userId = inputCache!.user_id!;
  return `the user is logged in. user id: ${userId}`;
}
