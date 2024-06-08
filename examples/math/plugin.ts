import { TypedMap } from "@asterai-io/sdk/collections";
import { parseFloat } from "string";
import { log_debug } from "@asterai-io/sdk";
export * from "@asterai-io/sdk/exports";

export function add(args: TypedMap<string, string>): string {
  const a = parseFloat(args.mustGet("a"));
  const b = parseFloat(args.mustGet("b"));
  log_debug(`adding ${a}+${b}=${a + b}`);
  return `${a + b}`;
}

export function mul(args: TypedMap<string, string>): string {
  const a = parseFloat(args.mustGet("a"));
  const b = parseFloat(args.mustGet("b"));
  return `${a * b}`;
}

export function div(args: TypedMap<string, string>): string {
  const numerator = parseFloat(args.mustGet("numerator"));
  const denominator = parseFloat(args.mustGet("denominator"));
  return `${numerator / denominator}`;
}

export function pow(args: TypedMap<string, string>): string {
  const base = parseFloat(args.mustGet("base"));
  const power = parseFloat(args.mustGet("power"));
  return `${base ** power}`;
}
