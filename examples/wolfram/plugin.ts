import { Log, getEnv } from "@asterai/sdk";
import { TextQueryRequest } from "./generated/TextQueryRequest";
import { TextQueryResponse } from "./generated/TextQueryResponse";
import { HttpRequestBuilder } from "@asterai/sdk";

export function textQuery(args: TextQueryRequest): TextQueryResponse {
  const appId = getEnv("APP_ID");
  if (!appId) {
    return new TextQueryResponse(`
      It looks like you haven't set your Wolfram Alpha app id. Please set it in the plugin settings as:
      APP_ID=<your app id>
      You can get an app id by signing up at https://developer.wolframalpha.com/portal/myapps
    `);
  }

  Log.debug(`Received text query: ${args.query}`);
  let response = new HttpRequestBuilder("api.wolframalpha.com")
  .method("GET")
  .path(`/v1/result`)
  .query("appid", appId)
  .query("i", args.query)
  .build()
  .send();

  return new TextQueryResponse(`According to Wolfram Alpha, ${args.query} is ${response.response}.`);
}
