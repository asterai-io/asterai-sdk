import os from "os";
import path from "path";
import fs from "fs";

const CONFIG_PATH = path.join(os.homedir(), "/.asterai-cli.json");

const getConfig = () => {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH).toString());
  } catch {
    config = {};
  }
  return config;
};

export const getConfigValue = <T>(key: string): T | undefined =>
  getConfig()[key];

export const setConfigValue = <T>(key: string, value: T) => {
  const config = getConfig();
  config[key] = value;
  const serialized = JSON.stringify(config);
  fs.writeFileSync(CONFIG_PATH, serialized);
};
