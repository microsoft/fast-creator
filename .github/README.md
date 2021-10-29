This folder represents GitHub Action resources.

All files in the `/workflows` subfolder are automatically used during the CI/CD process.

Each `workflow` file may contain secrets that require additional explanation and are included when running workflows. Secrets are always ALL_CAPITALIZED_ALPHANUMERIC_WORDS, UNDERSCORE_DELIMITED_WORDS, and WITHOUT ABBREVIATIONS for more intuitive understanding. The values, are maintained in 1Password by @awentzel, however, when unavailable can always be recreated and updated. They are never readable after the initial save. These secrets are stored in [GitHub Settings - Secret Actions](https://github.com/microsoft/fast-creator/settings/secrets/actions).

*Secrets*
* AZURE_CONNECTION_STRING_STORAGE: The connection string used to connect client-side applications to backend Azure CosmosDB.
* AZURE_PUBLISH_PROFILE_CREATE_ACTIVE: The publishing profile string used to deploy to the Active Region on Azure App Service Plans.
* AZURE_PUBLISH_PROFILE_CREATE_PASSIVE: The publishing profile string used to deploy to the Passive Region on Azure App Service Plans.
* AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_MUSHROOM_0D77CE210: The publishing profile string used to connect to Azure Static Web Apps for use in Pull Request validations. Note that this name is automatically created by the Azure Service upon creation.
* DISCORD_NOTIFICATION_WEBHOOK_ID: The identifier on Discord for `#ms-internal-notifications`. To find, click on the channel settings and find the integration webhook.
* DISCORD_NOTIFICATION_WEBHOOK_TOKEN: The identifier on Discord for `#ms-internal-notifications`. To find, click on the channel settings and find the integration webhook.
* GITHUB_TOKEN: This is created by default and useful for obtaining additional [permissions](https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/) during workflow runs.