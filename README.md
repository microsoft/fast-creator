# Welcome to FAST Creator 
Application for UI testing and development.

## Overview
The Creator is a React application that allows for editing web components and native HTML elements with a live preview. To accomplish this, the Creator utilizes the web worker Message System from the `@microsoft/fast-tooling` package and a series of components and services provided by both the `@microsoft/fast-tooling` and `@microsoft/fast-tooling-react` packages.

Each component or service registers itself with the Message System and sends navigation and data updates to allow all services and components to remain in sync.

Some of the components being used include the `<Form />` react component, used for editing data, the `<Navigation />` component, used for navigating through data in the form of a tree view and the `<Viewer />` component used to create an `<iframe>` which has width and height manipulations for different device orientations and dimensions. A few services being used are the AJV validation service, which checks and reports on the validity of data against a JSON schema, and the Monaco service which updates an instance of the Monaco Editor to remain in sync with the data and convert it back and forth from `DataDictionary` to html structures, as needed.

## Getting Started
Setup instructions are located in the [Contributors Guide](https://github.com/Microsoft/fast-creator/blob/main/CONTRIBUTING.md).

- Running the app locally: `npm start`
- Build production app: `npm run build`

## Testing
- Run all tests: `npm test`
- eslint all files: `npm run eslint`
- Code format all files: `npm run prettier`

## Troubleshooting
- The application uses service-workers, which means views might not update as expected during the development process. To ensure files are updated when changed, configure your developer tools to update the assets on reload: [As shown on Stack Overflow](https://stackoverflow.com/questions/40783790/disable-service-workers-when-in-development-mode).