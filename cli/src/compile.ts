import * as asc from "assemblyscript/asc";

export type CompileOptions = {
  inputFiles: string[];
  baseDir: string;
  libs: string;
  outputFile: string;
};

const COMPILER_OPTIONS: asc.APIOptions = {
  stdout: process.stdout,
  stderr: process.stderr,
};

export const compile = async (options: CompileOptions) => {
  const args = [
    "--exportRuntime",
    "--runtime",
    "stub",
    ...options.inputFiles,
    "--baseDir",
    options.baseDir,
    "--lib",
    options.libs,
    "--outFile",
    options.outputFile,
    "--optimize",
    "--debug",
  ];
  const result = await asc.main(args, COMPILER_OPTIONS);
  if (result.error) {
    throw result.error;
  }
};
