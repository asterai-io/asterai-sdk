import { Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import { execSync } from "node:child_process";
import axios from "axios";
import { getConfigValue } from "../config.js";
import os from "os";
import { inspect } from "util";

// Relative path from the plugin root directory.
const AS_PROTO_GEN_PATH: string = "./node_modules/.bin/as-proto-gen";
// const PRODUCTION_ENDPOINT_BASE_URL = "https://api.asterai.io";
const PRODUCTION_ENDPOINT_BASE_URL = "http://localhost:3030";
const STAGING_ENDPOINT_BASE_URL = "https://staging.api.asterai.io";

export type CodegenFlags = {
  manifest: string;
  outputDir: string;
  appId?: string;
  language?: string;
  staging?: boolean;
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
    appId: Flags.string({
      char: "a",
      description: "app id",
      required: false,
    }),
    language: Flags.string({
      char: "l",
      description: "language of generated typings",
      required: false,
      default: "js",
    }),
    staging: Flags.boolean({
      char: "s",
      description: "use staging endpoint",
      required: false,
      default: false,
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

  if (flags.appId && flags.language) {
    return generateTypings(
      outDir,
      flags.language,
      flags.appId,
      flags.staging ?? false,
    );
  }

  const absoluteAsProtoGenPath = path.join(baseDir, AS_PROTO_GEN_PATH);
  try {
    execSync("protoc --version");
  } catch (e) {
    console.error(
      "No protoc binary found. " +
        "Is protocol buffers installed on the system? " +
        "Download protocol buffers here: https://protobuf.dev/downloads",
    );
    return;
  }
  try {
    execSync(
      "protoc " +
        `--plugin='protoc-gen-as=${absoluteAsProtoGenPath}' ` +
        `--experimental_allow_proto3_optional ` +
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

const generateTypings = async (
  outDir: string,
  language: string,
  appId: string,
  shouldUseStaging: boolean,
) => {
  const manifests = await downloadEnabledPluginsManifests(
    appId,
    shouldUseStaging,
  );
  fs.writeFileSync(
    path.join(outDir, "manifests.json"),
    JSON.stringify(manifests, null, 2),
  );
  console.log("manifests.json generated successfully.");

  if (language === "ts") {
    // Aggregating all the manifests into a single file
    let aggregatedManifest = `
      syntax = 'proto3';
      \n
    `;

    // Saving it to a temporary file
    const osTmpDir = os.tmpdir();
    const tmpFilePath = path.join(osTmpDir, "plugins.asterai.proto");
    for (const manifest of manifests.protos) {
      aggregatedManifest += `${manifest.proto}\n`;
    }
    fs.writeFileSync(tmpFilePath, aggregatedManifest);

    execSync(`
      npx -p protobufjs-cli pbjs -t static --no-service ${tmpFilePath} -o ${path.join(outDir, "plugins.asterai.js")}
    `);
    execSync(`
      npx -p protobufjs-cli pbts -o ${path.join(outDir, "plugins.asterai.d.ts")} ${path.join(outDir, "plugins.asterai.js")}
    `);

    fs.unlinkSync(tmpFilePath);
    console.log("Typings generated successfully.");
  }
};

const downloadEnabledPluginsManifests = async (
  appId: string,
  shouldUseStaging: boolean,
): Promise<ExportedManifestFile> => {
  const baseUrl = shouldUseStaging
    ? STAGING_ENDPOINT_BASE_URL
    : PRODUCTION_ENDPOINT_BASE_URL;
  const response = await axios({
    url: `${baseUrl}/app/${appId}/plugin/manifests`,
    method: "GET",
    headers: {
      Authorization: getConfigValue("key"),
    },
  });

  return response.data;
};

type ExportedManifestFile = {
  protos: ExportedManifest[];
};

type ExportedManifest = {
  name: string;
  proto: string;
};
