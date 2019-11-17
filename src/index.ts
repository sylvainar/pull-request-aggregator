import {lintConfig} from "./services/config";
import { fetchData } from "./services/providers";

const main = async (config:Config):Promise<Repository[]> => {
  const configErrors = lintConfig(config);

  if (configErrors.length > 0) {
      console.error(configErrors);
      process.exit(1);
  }

  return fetchData(config);
};

export default main;