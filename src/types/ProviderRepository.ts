abstract class ProviderRepository {
    provider: IProvider;
    namespace: string;
    path: string;

    constructor (repository:IRepositoryConfig) {
        this.provider = repository.provider;
        this.namespace = repository.namespace;
        this.path = repository.path;
    };

    makeRepositoryId (providerId:string):string {
        return `${this.provider.name}-${providerId}`;
    }

    abstract getRepository (repository:IRepositoryConfig):Promise<IRepository>;

    abstract getPullRequests (repository:IRepositoryConfig):Promise<IPullRequest[]>;
}

export default ProviderRepository;