export * from "@asterai/sdk/exports";
export * from "@asterai/sdk";
import { PluginInput, PluginOutput, log_debug } from "@asterai/sdk";
import { semanticSearch } from "@asterai/sdk/semantics";

// TODO: shorten (assume auto prefix)
const COLLECTION_NAME = "app-abcb79b9-8de3-4d55-a652-660866201358-public-test";

export function processMessage(input: PluginInput): PluginOutput | null {
  log_debug("@ process message: " + input.content);
  let similarityResult = semanticSearch(input.content, COLLECTION_NAME);
  log_debug("similarity result: " + similarityResult);
  return new PluginOutput("embeddings").withSystemMessage(similarityResult);
}
