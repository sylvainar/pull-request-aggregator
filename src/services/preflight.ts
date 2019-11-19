import { Config } from '../types';

/**
 * Lint config.
 *
 * @param {Config} config - Config.
 * @returns {string[]} - Errors.
 */
const lintConfig = (config:Config):string[] => {
  const errors = [];

  if (!config.repositories) {
    errors.push('Missing repositories list.');
  }

  return errors;
};

export default (main:Function) => (config:Config) => {
  const configErrors = lintConfig(config);

  if (configErrors.length > 0) {
    throw new Error(JSON.stringify(configErrors));
  }

  return main(config);
};
