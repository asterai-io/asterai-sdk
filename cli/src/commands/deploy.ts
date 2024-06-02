import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import { compile, CompileOptions } from "../compile.js";
import FormData from "form-data";
import axios from "axios";
import { getConfigValue } from "../config.js";

export default class Deploy extends Command {
  static args = {
    input: Args.string({
      default: "plugin.ts",
    }),
  };

  static description = "compiles and uploads the plugin to asterai";

  static examples = [
    `<%= config.bin %> <%= command.id %> --app 66a46b12-b1a7-4b72-a64a-0e4fe21902b6`,
  ];

  static flags = {
    app: Flags.string({
      char: "a",
      description: "app ID to immediately configure this plugin with",
      required: true,
    }),
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.yaml",
    }),
    endpoint: Flags.string({
      char: "e",
      default: "https://api.asterai.io/app/plugin",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Deploy);
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
    const form = new FormData();
    form.append("app_id", flags.app);
    form.append("module", fs.createReadStream(outputFile));
    form.append("manifest", fs.createReadStream(manifestPath));
    await axios({
      url: flags.endpoint,
      method: "put",
      data: form,
      headers: {
        Authorization: getConfigValue("key"),
      },
    });
    console.log("done");
  }
}
