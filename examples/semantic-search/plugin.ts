import { VectorEmbedding, Log } from "@asterai/sdk";
import { PluginContext } from "./generated/PluginContext";
import { ProcessQueryOutput } from "./generated/ProcessQueryOutput";
import { HostVectorEmbeddingSearchRequest } from "@asterai/sdk/generated/HostVectorEmbeddingSearchRequest";

const COLLECTION_NAME = "public";
export function processQuery(input: PluginContext): ProcessQueryOutput {
  Log.info(`Searching for ${input.query.content}`);
  const request = new HostVectorEmbeddingSearchRequest();
  request.appCollectionName = COLLECTION_NAME;
  request.query = input.query.content;

  let similarityResult = VectorEmbedding.semanticSearch(request);

  let resultString = "";
  for (let i = 0; i < similarityResult.length; i++) {
    const result = similarityResult[i];
    let flattenedPayload = "";
    let keys = result.payload.keys() as Array<string>;
    for (let x = 0; x < keys.length; x++) {
      let payload = result.payload.get(keys[x]);
      flattenedPayload += `${keys[x]}: ${payload}, `;
    }
    flattenedPayload = flattenedPayload.slice(0, -2); 

    resultString += `embedding similarity (score=${result.score}): ${flattenedPayload}`;
  }

  Log.info(`${resultString}`);
  return new ProcessQueryOutput(resultString);
}
