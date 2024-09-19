export * from "@asterai/sdk/exports";
export * from "@asterai/sdk";
import { Context, Output, Query } from "@asterai/sdk";
import { semanticSearch } from "@asterai/sdk/semantics";

const COLLECTION_NAME = "public";

export function processMessage(input: Query): Output | null {
  let similarityResult = semanticSearch(input.content, COLLECTION_NAME);
  return new Output("embeddings").withSystemMessage(similarityResult);
}
