const { exec } = require("child_process");
const packageJson = require("../package.json");
const fs = require("fs");
const path = require("path");
const { git, parseRemoteBranch } = require("workspace-tools");

const dependenciesToUpdate = [
    "@microsoft/fast-tooling",
    "@microsoft/fast-tooling-react"
];
const cwd = path.resolve(__dirname);
const branch = "stage";

/**
 * Gets the latest version of the provided package name
 */
function getLatestToolingVersions(packageName) {
    return new Promise((resolve, reject) => {
        exec(`npm show ${packageName} time --json`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject();
            }
    
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject();
            }
    
            const parsedStdout = JSON.parse(stdout);
            const packageVersions = Object.keys(parsedStdout);
    
            resolve(packageVersions[packageVersions.length - 1]);
        });
    });
}

/**
 * Gets the current version of the provided package name
 */
function getCurrentToolingVersions(packageName) {
    return packageJson.dependencies[packageName].slice(1);
}

/**
 * Checks to see if there are any version updates that need to occur,
 * if there are, update the package JSON dependencies and the package-lock file
 */
async function updateDependencies () {
   const latestToolingVersions = {};
   const currentToolingVersions = {};
   let shouldUpdateVersion = false;

   for (let packageName of dependenciesToUpdate) {
        await getLatestToolingVersions(packageName).then(async (value) => {
            latestToolingVersions[packageName] = value;
        });
   }

    dependenciesToUpdate.forEach((packageName) => {
        currentToolingVersions[packageName] = getCurrentToolingVersions(packageName);
        
        if (currentToolingVersions[packageName] !== latestToolingVersions[packageName]) {
            shouldUpdateVersion = true;
        }
    });

    if (shouldUpdateVersion) {
        const updatedPackageJson = packageJson;

        dependenciesToUpdate.forEach((packageName) => {
            updatedPackageJson.dependencies[packageName] = `^${latestToolingVersions[packageName]}`;
        });
        
        // Update the package.json with the new versions
        fs.writeFileSync(
            path.resolve(__dirname, "../package.json"),
            JSON.stringify(updatedPackageJson, null, 2),
            {
                encoding: "utf8"
            }
        );

        // Install dependencies to update the package-lock file
        await new Promise((resolve, reject) => {
            exec("npm i", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject();
                }
        
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject();
                }

                resolve();
            });
        });

        // Update the version files for the "What's new" overlay
        await new Promise ((resolve, reject) => {
            exec("npm run convert:version-files", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject();
                }
        
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject();
                }

                resolve();
            });
        });

        // Stage new file updates
        await new Promise((resolve, reject) => {
            exec("git add .", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject();
                }
        
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject();
                }

                resolve();
            });
        }).catch((reason) => {
            console.error(reason);
        });

        // Commit new file updates
        await new Promise((resolve, reject) => {
            exec(`git commit -m "Update FAST Tooling dependencies"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject();
                }
        
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    reject();
                }

                resolve();
            });
        }).catch((reason) => {
            console.error(reason);
        });
    }
}

/**
 * Pushes the local branch updates to the remote
 */
function pushToRemote() {
    const { remote, remoteBranch } = parseRemoteBranch(branch);
    const pushArgs = ["push", "--no-verify", "--follow-tags", "--verbose", remote, `HEAD:${remoteBranch}`];
    console.log(`git ${pushArgs.join(" ")}`);

    const pushResult = git(pushArgs, { cwd });

    if (!pushResult.success) {
      console.warn(`[WARN]: push to ${remoteBranch} has failed!\n${pushResult.stderr}`);
    } else {
      console.log(pushResult.stdout.toString());
      console.log(pushResult.stderr.toString());
    }
}

updateDependencies().then(() => {
    pushToRemote();
});
