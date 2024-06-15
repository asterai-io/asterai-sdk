import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import { compile, CompileOptions } from "../compile.js";

export default class Build extends Command {
  static args = {
    input: Args.string({
      default: "plugin.ts",
    }),
  };

  static description = "compiles the plugin";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.yaml",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Build);
    const manifestPath = path.resolve(flags.manifest);
    const inputFile = path.resolve(args.input);
    if (!fs.existsSync(inputFile)) {
      throw new Error(`input file not found (${args.input})`);
    }
    const inputFileName = path.parse(inputFile).name;
    const baseDir = path.dirname(manifestPath);
    const outDir = path.join(baseDir, "build");
    const outputFile = path.join(outDir, `${inputFileName}.wasm`);
    const libsDir = path.join(baseDir, "node_modules");
    if (!fs.existsSync(libsDir)) {
      throw new Error("no node_modules found in the plugin directory");
    }
    const options: CompileOptions = {
      inputFile,
      baseDir,
      outputFile,
      libs: libsDir,
    };
    await compile(options);
  }
}
