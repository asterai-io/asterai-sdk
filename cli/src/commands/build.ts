import { Args, Command, Flags } from "@oclif/core";
import path from "path";
import fs from "fs";
import { compile, CompileOptions } from "../compile.js";
import Mustache from "mustache";
import protobuf, { Service } from "protobufjs";
import { mergeProtoImports } from "./deploy.js";

export type BuildArgs = {
  input: string;
};

export type BuildFlags = {
  manifest: string;
};

export type BuildOutput = {
  outputFile: string;
  manifestPath: string;
};

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
      default: "plugin.asterai.proto",
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Build);
    await build(args, flags);
  }
}

export const build = async (
  args: BuildArgs,
  flags: BuildFlags,
): Promise<BuildOutput> => {
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
  const proto = fs.readFileSync(manifestPath, { encoding: "utf8" });
  const functionDescriptors = getPluginFunctionDescriptors(proto, manifestPath);
  const inputFileContent = fs.readFileSync(inputFile, { encoding: "utf8" });
  assertPluginCodeHasAllFunctionsFromManifest(
    inputFileContent,
    functionDescriptors,
  );
  const entryPointCode = generateEntryPointCode(functionDescriptors);
  const mergedPluginCode = mergeInputPluginCodeWithEntrypoint(
    inputFileContent,
    entryPointCode,
  );
  const mergedTempFilePath = writeMergedPluginCodeTempFile(
    mergedPluginCode,
    path.parse(inputFile).dir,
    inputFileName,
  );
  const globalFile = path.join(libsDir, "@asterai/sdk/global.ts");
  const options: CompileOptions = {
    inputFiles: [mergedTempFilePath, globalFile],
    baseDir,
    outputFile,
    libs: libsDir,
  };
  try {
    await compile(options);
  } finally {
    fs.unlinkSync(mergedTempFilePath);
  }
  return {
    manifestPath,
    outputFile,
  };
};

type PluginFunctionDescriptor = {
  functionName: string;
  inputType: string;
  outputType: string;
};

const getPluginFunctionDescriptors = (
  proto: string,
  protoPath: string,
): PluginFunctionDescriptor[] => {
  const protoMerged = mergeProtoImports(proto, protoPath, false, false);
  const result = protobuf.parse(protoMerged);
  const namespace = result.root.resolveAll();
  const objects = namespace.nestedArray;
  const serviceObject = objects.find(o => (o as Service).methods !== undefined);
  if (!serviceObject) {
    throw new Error("no service found in plugin manifest");
  }
  const service = serviceObject as Service;
  return service.methodsArray.map(m => ({
    functionName: m.name,
    inputType: m.requestType,
    outputType: m.responseType,
  }));
};

type GeneratedEntryPointCode = {
  importsCode: string;
  entryPointsCode: string;
};

const generateEntryPointCode = (
  functionDescriptors: PluginFunctionDescriptor[],
): GeneratedEntryPointCode => {
  const importsCode = `
    import { Protobuf } from "@asterai/as-proto/assembly";
    import { readBufferFromPtr, writeBufferToPr } from "@asterai/sdk/buffer";
  `;
  let code = "\n// generated plugin entry points\n\n";
  for (const functionDescriptor of functionDescriptors) {
    const template: string = `
      export function {{func}}_entry_point(ptr: u32): u32 {
        const inputBuffer = readBufferFromPtr(ptr);
        const input = Protobuf.decode<{{inpt}}>(
          inputBuffer,
          {{inpt}}.decode,
        );
        const output = {{func}}(input);
        const outputBuffer = Protobuf.encode<{{outp}}>(
          output,
          {{outp}}.encode,
        );
        return writeBufferToPr(outputBuffer);
      }
    `;
    const view = {
      func: functionDescriptor.functionName,
      inpt: functionDescriptor.inputType,
      outp: functionDescriptor.outputType,
    };
    const functionEntryPoint = Mustache.render(template, view);
    code = `${code}\n${functionEntryPoint}`;
  }
  return {
    importsCode,
    entryPointsCode: code,
  };
};

const mergeInputPluginCodeWithEntrypoint = (
  pluginCode: string,
  entryPoint: GeneratedEntryPointCode,
): string =>
  `${entryPoint.importsCode}\n${pluginCode}\n${entryPoint.entryPointsCode}`;

const writeMergedPluginCodeTempFile = (
  source: string,
  inputFileDir: string,
  inputFileName: string,
): string => {
  const tempFileName = `.entrypoint.${inputFileName}.ts`;
  const tempFilePath = path.join(inputFileDir, tempFileName);
  fs.writeFileSync(tempFilePath, source, { encoding: "utf8" });
  return tempFilePath;
};

/**
 * Throw an error if the plugin WASM source is missing a function from
 * the manifest.
 * The only purpose of this function is to let the user know about
 * the issue in a direct way.
 */
const assertPluginCodeHasAllFunctionsFromManifest = (
  source: string,
  functionDescriptors: PluginFunctionDescriptor[],
) => {
  for (const functionDescriptor of functionDescriptors) {
    const includesFunction = source.includes(
      `function ${functionDescriptor.functionName}`,
    );
    if (!includesFunction) {
      throw new Error(
        `function "${functionDescriptor.functionName}" was defined in plugin ` +
          "manifest (.proto file) but is missing from plugin code",
      );
    }
  }
};
