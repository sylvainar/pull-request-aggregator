import GithubProvider from '../providers/repositories/GithubRepository';
import GitlabProvider from '../providers/repositories/GitlabRepository';
import { Config, Repository, RepositoryConfig } from '../types';

const Providers = [
  GithubProvider,
  GitlabProvider,
];

const getRepository = (repositoryConfig:RepositoryConfig) => {
  const ApplicableProvider = Providers.find(
    (Provider) => Provider.repositoryId === repositoryConfig.provider.name,
  );

  if (!ApplicableProvider) {
    throw new Error(`No provider for ${repositoryConfig.provider.name}`);
  }

  return new ApplicableProvider(repositoryConfig);
};

export const fetchData = async (config:Config):Promise<Repository[]> => Promise.all(
  config.repositories.map(async (repositoryConfig) => {
    const repository = getRepository(repositoryConfig);

    const repositoryData = await repository.getRepository();

    const pullRequests = await repository.getPullRequests();

    return {
      ...repositoryData,
      pulls: pullRequests,
    };
  }),
);
