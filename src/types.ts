interface Config {
    repositories: RepositoryConfig[],
}

interface Provider {
    name: string,
    options: any,
}

interface RepositoryMetadata {
    // Could be pretty much anything depending
    // on what the user needs.
}

interface RepositoryConfig {
    metadata: RepositoryMetadata,
    path: string,
    provider: Provider,
}

interface Repository {
    id: string,
    name: string,
    metadata: RepositoryMetadata,
    url: string,
    updatedAt: Date,
    pulls?: PullRequest[],
}

interface PullRequest {
    id: string,
    url: string,
    title: string,
    labels: Label[],
}

interface Label {
    id: string,
    name: string,
    color: string,
}
