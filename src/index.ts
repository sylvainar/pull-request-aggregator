import preflight from './services/preflight';
import { fetchData } from './services/providers';
import { Config, Repository } from './types';

const main = async (config:Config):Promise<Repository[]> => fetchData(config);

export default preflight(main);
