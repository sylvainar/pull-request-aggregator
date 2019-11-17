const util = require('util');
const pullRequestAggregator = require('../dist').default;

const config = {
    repositories: [
        {
            // Relative path to your repository.
            path: 'WeblateOrg/weblate',
            provider: {
                // The provider.
                name:'github'

                // More options related to the provider (auth, config...)
            },
            metadata: {
                // You'll get those back in the response, so put everything
                // you need to build your screens.
                namespace: 'Pro/Customer1/Project1',
            },
        },
        {
            path: 'fdroid/fdroidclient',
            provider: {
                name:'gitlab'
            },
            metadata: {
                namespace: 'Perso/hello',
            },
        },
    ],
};

pullRequestAggregator(config)
    .then(result => {
        console.log(util.inspect(result, false, null, true))
    })
    .catch(console.error);