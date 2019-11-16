interface IConfig {
    repositories: IRepositoryConfig[],
}

interface IProvider {
    name: string,
    options: any,
}

interface IRepositoryConfig {
    namespace: string,
    path: string,
    provider: IProvider,
}

interface IRepository {
    id: string,
    name: string,
    url: string,
    updatedAt: Date,
    pulls: IPullRequest[],
}

interface IPullRequest {
    id: string,
    url: string,
    title: string,
    labels: ILabel[],
}

interface ILabel {
    id: string,
    name: string,
    color: string,
}
