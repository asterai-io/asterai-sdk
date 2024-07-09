import { AddArgs } from "./generated/AddArgs";
import { MulArgs } from "./generated/MulArgs";
import { DivArgs } from "./generated/DivArgs";
import { PowArgs } from "./generated/PowArgs";
export * from "@asterai/sdk/exports";

export function add(args: AddArgs): string {
  return `${args.a + args.b}`;
}

export function mul(args: MulArgs): string {
  return `${args.a * args.b}`;
}

export function div(args: DivArgs): string {
  return `${args.numerator / args.denominator}`;
}

export function pow(args: PowArgs): string {
  return `${args.base ** args.power}`;
}
