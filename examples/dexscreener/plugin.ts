import { SearchTokenInput } from "./generated/SearchTokenInput";
import { GenericResponse } from "./generated/GenericResponse";
import { HttpRequestBuilder, Log } from "@asterai/sdk";

export function searchCryptoToken(args: SearchTokenInput): GenericResponse {
  Log.debug(`Received search request for ${args.query}`);
  const response = new HttpRequestBuilder("api.dexscreener.com")
    .method("GET")
    .path("/latest/dex/search")
    .query("q", args.query)
    .build()
    .send()

  Log.debug(`Received response: ${response.response}`);

  return new GenericResponse(`${response.response}`);
}
