/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import h from "../site-utilities/web-components/pragma";

const fastToolingPackageName = "@microsoft/fast-tooling" as const;
const fastToolingReactPackageName = "@microsoft/fast-tooling-react" as const;
const fastCreatorPackageName = "@microsoft/fast-creator" as const;

interface CurrentVersions {
    [fastToolingPackageName]: string;
    [fastToolingReactPackageName]: string;
    [fastCreatorPackageName]: string;
}

interface VersionComment {
    author: string;
    comment: string;
    commit: string;
    package: string;
}

interface BeachballEntryComments {
    patch?: VersionComment[];
    minor?: VersionComment[];
    major?: VersionComment[];
}

interface BeachballEntry {
    date: string;
    tag: string;
    version: string;
    comments: BeachballEntryComments;
}

interface BeachballChangelog {
    name: string;
    entries: BeachballEntry[];
}

export const userToolingVersionKey: string = "fast-creator::tooling-version";
export const userToolingReactVersionKey: string = "fast-creator::tooling-react-version";
export const userCreatorVersionKey: string = "fast-creator::creator-version";

function setUserLastVisit(
    currentCreatorVersion: string,
    currentToolingReactVersion: string,
    currentToolingVersion: string
): void {
    localStorage.setItem(userCreatorVersionKey, currentCreatorVersion);
    localStorage.setItem(userToolingReactVersionKey, currentToolingReactVersion);
    localStorage.setItem(userToolingVersionKey, currentToolingVersion);
}

function renderWhatsNewInVersion(
    version: "major" | "patch" | "minor",
    versionComments: VersionComment[]
): JSX.Element {
    return (
        <div>
            <h4>{version}</h4>
            <ul className={"entries"}>
                {versionComments.map((versionComment: VersionComment, index: number) => {
                    return <li key={"version" + index}>{versionComment.comment}</li>;
                })}
            </ul>
        </div>
    );
}

function getWhatsNewDialogContent(changes: BeachballChangelog[]): JSX.Element {
    return (
        <div className={"dialog"}>
            <h2>Recent Updates</h2>
            {changes.map(
                (value: BeachballChangelog): JSX.Element => {
                    return (
                        <div key={value.name}>
                            <fast-badge fill="primary" color="primary">
                                {value.name}
                            </fast-badge>
                            <ul className={"versions"}>
                                {value.entries.map(entry => {
                                    return (
                                        <li key={entry.version}>
                                            <h3>{entry.version}</h3>
                                            <span>{entry.date}</span>
                                            {entry.comments.major
                                                ? renderWhatsNewInVersion(
                                                      "major",
                                                      entry.comments.major
                                                  )
                                                : null}
                                            {entry.comments.minor
                                                ? renderWhatsNewInVersion(
                                                      "minor",
                                                      entry.comments.minor
                                                  )
                                                : null}
                                            {entry.comments.patch
                                                ? renderWhatsNewInVersion(
                                                      "patch",
                                                      entry.comments.patch
                                                  )
                                                : null}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                }
            )}
        </div>
    );
}

interface WhatsNewDialogProps {
    userCreatorVersion: string | null;
    userToolingReactVersion: string | null;
    userToolingVersion: string | null;
    showWhatsNew: boolean;
    updateWhatsNewAvailability: (whatsNew: boolean) => void;
    updateWhatsNewVisibility: (e: any) => void;
}

export class WhatsNewDialog extends React.Component<WhatsNewDialogProps, {}> {
    private dialogContent: JSX.Element | string | void = "Loading...";

    constructor(props: WhatsNewDialogProps) {
        super(props);

        renderWhatsNewDialog(
            this.props.userToolingVersion,
            this.props.userToolingReactVersion,
            this.props.userCreatorVersion
        ).then(content => {
            this.dialogContent = content;
            this.props.updateWhatsNewAvailability(!!content);
        });
    }

    render(): React.ReactNode {
        return this.props.showWhatsNew ? (
            <fast-dialog style={{ position: "relative", zIndex: 1 }}>
                {this.dialogContent}
                <fast-button onClick={this.props.updateWhatsNewVisibility}>
                    Close
                </fast-button>
            </fast-dialog>
        ) : null;
    }
}

export function renderWhatsNewDialog(
    userToolingVersion: XOR<string, null>,
    userToolingReactVersion: XOR<string, null>,
    userCreatorVersion: XOR<string, null>
): Promise<void | JSX.Element> {
    return import("../generated/current-version.json")
        .then((module: CurrentVersions) => {
            return module;
        })
        .then((value: CurrentVersions) => {
            return Promise.all([
                import("../generated/fast-creator-package-changes.json").then(
                    (module: BeachballChangelog) => {
                        return module;
                    }
                ),
                import("../generated/fast-tooling-react-package-changes.json").then(
                    (module: BeachballChangelog) => {
                        return module;
                    }
                ),
                import("../generated/fast-tooling-package-changes.json").then(
                    (module: BeachballChangelog) => {
                        return module;
                    }
                ),
            ])
                .then(values => {
                    const changes: BeachballChangelog[] = [];

                    if (userCreatorVersion !== value[fastCreatorPackageName]) {
                        changes.push(values[0]);
                    }

                    if (userToolingReactVersion !== value[fastToolingReactPackageName]) {
                        changes.push(values[1]);
                    }

                    if (userToolingVersion !== value[fastToolingPackageName]) {
                        changes.push(values[2]);
                    }

                    setUserLastVisit(
                        values[0].entries[0].version,
                        values[1].entries[0].version,
                        values[2].entries[0].version
                    );

                    if (changes.length === 0) {
                        return;
                    }

                    return getWhatsNewDialogContent(changes);
                })
                .catch(err => {
                    return (
                        <div>
                            A problem occurred when trying to find the latest changes.
                        </div>
                    );
                });
        })
        .catch(() => {
            return <div>A problem occurred when trying to find the latest changes.</div>;
        });
}
