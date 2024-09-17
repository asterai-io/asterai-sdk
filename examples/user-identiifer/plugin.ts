import { PluginInput, PluginOutput } from "@asterai/sdk";
import { GetUserIdArgs } from "./generated/GetUserIdArgs";
export * from "@asterai/sdk/exports";

let inputCache: PluginInput | null = null;

export function processMessage(input: PluginInput): PluginOutput | null {
  inputCache = input;
  return null;
}

export function getUserId(args: GetUserIdArgs): string {
  if (inputCache == null) {
    return "input cache never received. bug?";
  }
  if (inputCache!.userId == null) {
    return "no user id found. not logged in.";
  }
  const userId: string = inputCache!.userId!;
  return `the user id is '${userId}'`;
}
