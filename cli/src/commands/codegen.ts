import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import { execSync } from "node:child_process";

// Relative path from the CLI root directory.
const AS_PROTO_GEN_PATH: string = "node_modules/.bin/as-proto-gen";

export type CodegenFlags = {
  manifest: string;
  outputDir: string;
};

export default class Codegen extends Command {
  static args = {};
  static description = "Generate code from the plugin manifest";

  static examples = [`<%= config.bin %> <%= command.id %>`];

  static flags = {
    manifest: Flags.string({
      char: "m",
      description: "manifest path",
      default: "plugin.asterai.proto",
    }),
    outputDir: Flags.string({
      char: "o",
      description: "output directory",
      default: "generated",
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Codegen);
    codegen(flags);
  }
}

export const codegen = (flags: CodegenFlags) => {
  const manifestPath = path.resolve(flags.manifest);
  const baseDir = path.dirname(manifestPath);
  const outDir = path.join(baseDir, flags.outputDir);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  } else {
    deleteOldGeneratedFiles(outDir);
  }
  const cliRootDir = getCliRootDir();
  const absoluteAsProtoGenPath = path.join(cliRootDir, AS_PROTO_GEN_PATH);
  try {
    execSync(
      "protoc " +
        `--plugin='protoc-gen-as=${absoluteAsProtoGenPath}' ` +
        `--as_out='./${flags.outputDir}' ./${flags.manifest}`,
    );
  } catch (e) {
    console.error("Failed to generate protobuf types:", e);
  }
};

const deleteOldGeneratedFiles = (outDir: string) => {
  const oldFiles = fs.readdirSync(outDir);
  for (const oldFile of oldFiles) {
    const file = path.parse(oldFile);
    if (file.ext !== ".ts") {
      continue;
    }
    const deletePath = path.join(outDir, oldFile);
    fs.unlinkSync(deletePath);
  }
};

const getCliRootDir = (): string => {
  const fullCliBinPath = path.parse(process.argv[1]).dir;
  return path.join(fullCliBinPath, "../");
};
