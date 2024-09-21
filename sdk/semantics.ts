import { host } from "./index";
import { TypedMap } from "./collections";

export function semanticSearch(query: string, collectionName: string): string {
  let request = new TypedMap<string, string>();
  request.set("query", query);
  request.set("collection", collectionName);
  return host.semantic_search(request);
}
