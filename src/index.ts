import { lintConfig } from './services/config';
import { fetchData } from './services/providers';
import { Config, Repository } from './types';

const main = async (config:Config):Promise<Repository[]> => {
  const configErrors = lintConfig(config);

  if (configErrors.length > 0) {
    throw new Error(JSON.stringify(configErrors));
  }

  return fetchData(config);
};

export default main;
