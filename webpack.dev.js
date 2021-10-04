/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const merge = require("webpack-merge");
const baseConfigs = require("./webpack.common");

module.exports = baseConfigs.map(baseConfig => {
    return merge(baseConfig, {
        devServer: {
            open: true,
            port: 7777,
        },
        mode: "development",
        output: {
            filename: "[name].js",
        },
        /* 
         * Symlinking with fast-tooling requires that all of the fast packages be aliased
         * to ensure that only the creator version of the package is included. Otherwise
         * bad stuff happens (like jitRegister errors and loss of component CSS).
         */
        resolve:{
            alias: {
                "@microsoft/fast-element": path.resolve("node_modules/@microsoft/fast-element"),
                "@microsoft/fast-foundation": path.resolve("node_modules/@microsoft/fast-foundation"),
                "@microsoft/fast-components": path.resolve("node_modules/@microsoft/fast-components"),
                "react": path.resolve("node_modules/react"),
                "react-dom": path.resolve("node_modules/react-dom"),
                "react-dnd": path.resolve("node_modules/react-dnd"),
            }
        }
    });
});
