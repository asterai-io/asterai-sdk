export * from "@asterai/sdk/exports";
export * from "@asterai/sdk";
import { PluginInput, PluginOutput } from "@asterai/sdk";
import { semanticSearch } from "@asterai/sdk/semantics";

const COLLECTION_NAME = "public";

export function processMessage(input: PluginInput): PluginOutput | null {
  let similarityResult = semanticSearch(input.content, COLLECTION_NAME);
  return new PluginOutput("embeddings").withSystemMessage(similarityResult);
}
