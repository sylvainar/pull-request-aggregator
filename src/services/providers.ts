import * as GithubProvider from '../providers/Github';
import * as GitlabProvider from '../providers/Gitlab';

const getProvider = (repository:IRepositoryConfig) => {
    switch (repository.provider.name) {
        case 'gitlab':
            return GitlabProvider;
        case 'github':
            return GithubProvider;
        default:
            throw new Error(`No provider for ${repository.provider.name}`);
    }
};

export const fetchData = async (config:IConfig):Promise<IRepository[]> => Promise.all(
    config.repositories.map(async repository => {
        const Provider = getProvider(repository);

        const repositoryData = await Provider.getRepository(repository);

        const pullRequests = await Provider.getPullRequests(repository);

        return {
            ...repositoryData,
            pulls: pullRequests,
        }
    }),
);