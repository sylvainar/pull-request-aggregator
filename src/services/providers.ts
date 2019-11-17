import GithubProvider from '../providers/GithubRepository';
import GitlabProvider from '../providers/GitlabRepository';

const getRepository = (repositoryConfig:IRepositoryConfig) => {
    switch (repositoryConfig.provider.name) {
        case 'gitlab':
            return new GitlabProvider(repositoryConfig);
        case 'github':
            return new GithubProvider(repositoryConfig);
        default:
            throw new Error(`No provider for ${repositoryConfig.provider.name}`);
    }
};

export const fetchData = async (config:IConfig):Promise<IRepository[]> => Promise.all(
    config.repositories.map(async repositoryConfig => {
        const repository = getRepository(repositoryConfig);

        const repositoryData = await repository.getRepository();

        const pullRequests = await repository.getPullRequests();

        return {
            ...repositoryData,
            pulls: pullRequests,
        }
    }),
);