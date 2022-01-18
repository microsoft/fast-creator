# Contributing to FAST Creator

## Getting started

### Machine setup

To work with the FAST Creator repository you'll need Git, Node.js, and NPM setup on your machine.

FAST Creator uses Git as its source control system. If you haven't already installed it, you can download it [here](https://git-scm.com/downloads) or if you prefer a GUI-based approach, try [GitHub Desktop](https://desktop.github.com/).

Once Git is installed, you'll also need Node.js, which FAST Creator uses as its JavaScript runtime, enabling its build and test scripts. Node.js instructions and downloads for your preferred OS can be found [here](https://nodejs.org/en/).

:::important
The above steps are a one-time setup for your machine and do not need to be repeated after the initial configuration.
:::

### Cloning the repository

Now that your machine is setup, you can clone the FAST Creator repository. Open a terminal and run this command:

```shell
git clone https://github.com/microsoft/fast-creator.git
```
Cloning via SSH:

```shell
git clone git@github.com:microsoft/fast-creator.git
```

### Installing and building

From within the `fast-creator` folder where you've cloned the repo, install all package dependencies from the `package-lock.json` with this command:

```bash
npm ci
```

### Testing

To run all tests for all packages, use the following command:

```bash
npm run test
```

:::note
The root level file `package.json` file contains a `scripts` section that defines the commands available to you for common tasks such as build, test, lint, etc.
:::

### Symlinking to FAST Tooling

To use the npm link feature to work simultaneously in @microsoft/fast-tooling and Creator execute the following commands:

In the FAST Tooling repository execute this command in both the `/packages/fast-tooling` and `/packages/fast-tooling-react` folders:
```bash
npm link
```

Then in the root folder of the FAST Creator repository execute the following commands:
```bash
npm link @microsoft/fast-tooling
npm link @micorosft/fast-tooling-react
```

Creator will now use your local copy of FAST Tooling and any changes made and built in FAST Tooling should automatically be used by Creator.

### Submitting a pull request

If you'd like to contribute by fixing a bug, implementing a feature, or even correcting typos in our documentation, you'll want to submit a pull request. Before submitting a pull request, be sure to [rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing) your branch from `stage` or use the *merge* button provided by GitHub.
When submitting your pull request please make the title clear and concise, provide a description of the change, and specify the issue that will be closed.

### DevOps

#### Understanding 'secrets' in code
FAST Creator utilizes secrets in code as a security best practice. There are two types of secrets:
1. Secrets for use on GitHub Actions in workflow files. [Learn more](`./.github/CONFIGURATION.md`)
2. Secrets for use as Application settings on Azure App Services. [Learn more](`./build/README.md`)

To help assist when working in code with secrets there are README files in their respective directories to clearly explain how to manage.

### Merging a pull request

If you are merging a pull request, be sure to use the pull request title as the commit title. It is recommended that if you are merging in pull requests regularly that you add a browser extension that will auto-correct the title for you. A few that should do this are [Refined GitHub](https://github.com/sindresorhus/refined-github) and [Squashed Merge Message](https://github.com/zachwhaley/squashed-merge-message).

For further reading on how commits are created through the GitHub interface during pull request merging, read this [article](https://docs.github.com/en/github/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/merging-a-pull-request#merging-a-pull-request).

### Recommended Settings for Visual Studio Code

You can use any code editor you like when working with the FAST Creator monorepo. One of our favorites is [Visual Studio Code](https://code.visualstudio.com/). VS Code has great autocomplete support for TypeScript and JavaScript APIs, as well as a rich ecosystem of plugins.

Default VS Code settings for this project are configured as [Workspace settings](https://code.visualstudio.com/docs/getstarted/settings) in the `.vscode` directory. These settings override user settings for the workspace and are configured to ensure consistent code formatting across different environments. We also include a list of [Workspace recommended extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions) for VS Code for syntax highlighting and code linting.

## FAST guidance

The FAST Creator project follows the contribution policy outlined in the FAST project for their [governance](https://github.com/microsoft/fast/blob/master/CONTRIBUTING.md#governance), and [stability policy](https://github.com/microsoft/fast/blob/master/CONTRIBUTING.md#stability-policy).

## Acceptance and consensus seeking process

Acceptance of contributions follows the consensus-seeking process.

All pull requests must be approved by at least one *code owner* before the pull request can be accepted.

Before a pull request is accepted, time should be given to receive input from *collaborators* and/or *code owners* with the expertise to evaluate the changes. The amount of time can vary but at least 3 days during the typical working week and 5 days over weekends should be given to account for international time differences and work schedules.

Specific *collaborators* or *code owners*  can be added to a pull request by including their user alias.

All work that is done should correspond to a milestone, for more information on process and planning check out the [process document](./PROCESS.md).
