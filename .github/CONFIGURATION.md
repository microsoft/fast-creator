The `.github/` folder represents configuration for GitHub specific integration with the project.

## Workflows
All files in the `/workflows` subfolder are automatically used during the CI/CD process.

Each `workflow` file may contain secrets that require additional explanation and are included when running workflows. Secrets are always ALL_CAPITALIZED_ALPHANUMERIC_WORDS, UNDERSCORE_DELIMITED_WORDS, and WITHOUT ABBREVIATIONS for more intuitive understanding. The values, are maintained in 1Password by @awentzel, however, when unavailable can always be recreated and updated. They are never readable after the initial save. These secrets are stored in [GitHub Settings - Secret Actions](https://github.com/microsoft/fast-creator/settings/secrets/actions).

### Secrets
* AZURE_CONNECTION_STRING_STORAGE: The connection string used to connect client-side applications to backend Azure CosmosDB.
* AZURE_PUBLISH_PROFILE_CREATOR: The publishing profile string used to deploy to Azure App Services.
* AZURE_STATIC_WEB_APP_PR_TOKEN: The publishing profile string used to connect to Azure Static Web Apps for use in Pull Request validations.
* DISCORD_NOTIFICATION_WEBHOOK_ID: The identifier on Discord for `#ms-internal-notifications`. To find, click on the channel settings and find the integration webhook.
* DISCORD_NOTIFICATION_WEBHOOK_TOKEN: The identifier on Discord for `#ms-internal-notifications`. To find, click on the channel settings and find the integration webhook.
* GITHUB_TOKEN: This is created by default and useful for obtaining additional [permissions](https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/) during workflow runs.
* GH_TOKEN: This is created using a PAT, for details on why we use this secret sometimes and how to create it, see [below](#git-authentication-best-practices)

### GIT Authentication Best Practices
1. Automated committing to a protected branch such as `main` requires a PAT (Personal Access Token) from a user with 'git' security permissions specifying 'repo' during the creation of the PAT.
2. This token should be added to the repositories GitHub Secrets as `GH_TOKEN`.
3. The token can then be referred to in GitHub workflows as `GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}`.