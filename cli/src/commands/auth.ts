import { Args, Command } from "@oclif/core";
import { getConfigValue, setConfigValue } from "../config.js";

export default class Auth extends Command {
  static args = {
    key: Args.string({
      required: true,
    }),
  };

  static description = "authenticate to asterai";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {};

  async run(): Promise<void> {
    const { args } = await this.parse(Auth);
    setConfigValue("key", args.key);
    const value = getConfigValue("key");
  }
}
