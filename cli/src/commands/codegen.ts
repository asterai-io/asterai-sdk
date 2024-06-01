import { Args, Command, Flags } from "@oclif/core";

export default class Codegen extends Command {
  static args = {
    manifest: Args.string({
      default: "plugin.asterai.yaml",
    }),
  };
  static description = "Generate code from the plugin manifest";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {};

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Codegen);
    this.log("running codegen");
  }
}
