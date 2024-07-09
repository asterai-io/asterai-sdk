import { OrderBurgerArgs } from "./generated/OrderBurgerArgs";
export * from "@asterai/sdk/exports";

export function orderBurger(args: OrderBurgerArgs): string {
  // TODO: make http call to burger API.
  return `burger delivered to ${args.address}`;
}
