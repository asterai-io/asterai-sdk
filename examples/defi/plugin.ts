import { HttpRequestBuilder } from "@asterai-io/sdk/http";
import { SearchCryptoTokenArgs } from "./generated/SearchCryptoTokenArgs";
export * from "@asterai-io/sdk/exports";

export function searchCryptoToken(args: SearchCryptoTokenArgs): string {
  return new HttpRequestBuilder("api.dexscreener.com")
    .method("GET")
    .path("/latest/dex/search")
    .query("q", args.query)
    .build()
    .send().content;
}
