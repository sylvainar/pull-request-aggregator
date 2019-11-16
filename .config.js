module.exports = {
    repositories: [
        {
            namespace: 'Perso/Agg',
            path: 'WeblateOrg/weblate',
            provider: {
                name:'github'
            },
        },
        {
            namespace: 'Pro/hello',
            path: 'fdroid/fdroidclient',
            provider: {
                name:'gitlab'
            },
        },
    ],
};