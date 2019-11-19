import {
  Config,
  Repository,
  RepositoryConfig,
} from '../types';
import { ProvidersDictionary } from '../providers/ProviderRepository';

// Import providers here.
import GithubProvider from '../providers/repositories/GithubRepository';
import GitlabProvider from '../providers/repositories/GitlabRepository';

// Load providers here.
const Providers = [
  GithubProvider,
  GitlabProvider,
];

const ProvidersMap = Providers.reduce((acc, ProviderConstructor) => {
  acc[ProviderConstructor.repositoryId] = ProviderConstructor;
  return acc;
}, <ProvidersDictionary> {});

const getRepository = (repositoryConfig:RepositoryConfig) => {
  const ApplicableProvider = ProvidersMap[repositoryConfig.provider.name];

  if (!ApplicableProvider) {
    throw new Error(`No provider for ${repositoryConfig.provider.name}`);
  }

  return new ApplicableProvider(repositoryConfig);
};

export const fetchData = async (config:Config):Promise<Repository[]> => Promise.all(
  config.repositories.map(async (repositoryConfig) => {
    const repository = getRepository(repositoryConfig);

    const [
      repositoryData,
      pulls,
    ] = await Promise.all([
      repository.getRepository(),
      repository.getPullRequests(),
    ]);

    return {
      ...repositoryData,
      pulls,
    };
  }),
);
