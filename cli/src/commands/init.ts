import { Command, Flags } from "@oclif/core";
import path from "path";
import YAML from "yaml";
import fs from "fs";
import { WriteStream } from "node:fs";

export default class Codegen extends Command {
  static args = {};
  static description = "Create a new plugin project";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.yaml",
    }),
    outputDir: Flags.string({
      char: "o",
      description: "output directory",
      default: "generated",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Codegen);
    const manifestPath = path.resolve(flags.manifest);
    const baseDir = path.dirname(manifestPath);
    const outDir = path.join(baseDir, flags.outputDir);
    const manifest = ManifestSchema.parse(
      YAML.parse(fs.readFileSync(manifestPath, "utf8")),
    );
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    for (const func of manifest.functions) {
      const className = `${capitaliseFirstLetter(func.name)}Args`;
      const fileName = `${className}.ts`;
      const filePath = path.join(outDir, fileName);
      const stream = fs.createWriteStream(filePath);
      writeFunctionFile(className, func.arguments, stream);
    }
  }
}

const writeFunctionFile = (
  className: string,
  args: ManifestFunctionArgumentSchema[],
  stream: WriteStream,
) => {
  stream.write(`\
import {parseTypeFromString, TypedMap} from "@asterai-io/sdk/collections";

export class ${className} extends TypedMap<string, string> {
  ${args.map(renderArgGetterString).join("")}
}    
  `);
};

const renderArgGetterString = (arg: ManifestFunctionArgumentSchema): string =>
  `
  public get ${arg.name}(): ${arg.type} {
    ${
      arg.type === "string"
        ? `return this.mustGet("${arg.name}")`
        : `
    const value = this.mustGet("${arg.name}");
    return parseTypeFromString<${arg.type}>(value, "${arg.type}");
        `.trim()
    }
  }
  `;

const capitaliseFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
