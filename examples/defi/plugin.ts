import { TypedMap } from "@asterai-io/sdk/collections";
import { HttpRequestBuilder } from "@asterai-io/sdk/http";
export * from "@asterai-io/sdk/exports";

export function searchCryptoToken(args: TypedMap<string, string>): string {
  const query = args.mustGet("query");
  return new HttpRequestBuilder("api.dexscreener.com")
    .method("GET")
    .path("/latest/dex/search")
    .query("q", query)
    .build()
    .send().content;
}
