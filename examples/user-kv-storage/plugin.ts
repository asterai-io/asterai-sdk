import { GetValueArgs } from "./generated/GetValueArgs";
import { GetValueResponse } from "./generated/GetValueResponse";
import { UserKvStorage } from "@asterai/sdk";
import { SetValueArgs } from "./generated/SetValueArgs";
import { Nothing } from "./generated/Nothing";

export function setValue(input: SetValueArgs): Nothing {
  const userId = input.context.query.userId || "public";
  const storage = new UserKvStorage(userId);
  storage.setString(input.key, input.value);
  return new Nothing();
}

export function getValue(input: GetValueArgs): GetValueResponse {
  const userId = input.context.query.userId || "public";
  const storage = new UserKvStorage(userId);
  let value = storage.getString(input.key) || "null";
  if (value.length == 0) {
    value = "null";
  }
  return new GetValueResponse(`stored value: ${value}`);
}
