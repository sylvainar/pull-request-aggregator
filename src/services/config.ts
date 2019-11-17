import { Config } from '../types';

/**
 * Lint config.
 *
 * @param {Config} config - Config.
 * @returns {string[]} - Errors.
 */
export const lintConfig = (config:Config):string[] => {
  const errors = [];

  if (!config.repositories) {
    errors.push('Missing repositories list.');
  }

  return errors;
};
