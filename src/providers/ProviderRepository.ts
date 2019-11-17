abstract class ProviderRepository {
    provider: Provider;
    metadata: RepositoryMetadata;
    path: string;

    constructor (repository:RepositoryConfig) {
        this.provider = repository.provider;
        this.metadata = repository.metadata;
        this.path = repository.path;
    };

    /**
     * Make a UNIQUE repository id (even across providers).
     *
     * @param {string} providerId - Provider id.
     * @returns {string} - Unique Id.
     */
    makeRepositoryId (providerId:string):string {
        return `${this.provider.name}-${providerId}`;
    }

    abstract getRepository (repository:RepositoryConfig):Promise<Repository>;

    abstract getPullRequests (repository:RepositoryConfig):Promise<PullRequest[]>;
}

export default ProviderRepository;