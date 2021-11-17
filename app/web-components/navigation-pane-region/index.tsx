/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import { DataType, MessageSystem, voidElements } from "@microsoft/fast-tooling";
import { ModularNavigation } from "@microsoft/fast-tooling-react";
import h from "../pragma";
import { NavigationId } from "../../creator.props";
import { elementLibraries } from "../../configs";

function renderStartIcon(isIncluded: boolean): React.ReactNode {
    if (isIncluded) {
        return (
            <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M11.8639 0.65511C12.0533 0.856064 12.0439 1.17251 11.8429 1.36191L3.91309 8.8358C3.67573 9.05952 3.30311 9.05263 3.07417 8.82028L0.393838 6.09995C0.200027 5.90325 0.202372 5.58667 0.399074 5.39286C0.595777 5.19905 0.912351 5.2014 1.10616 5.3981L3.51192 7.83975L11.1571 0.634189C11.358 0.44479 11.6745 0.454157 11.8639 0.65511Z"
                    fill="#FFFFFF"
                />
            </svg>
        );
    }

    return (
        <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 0.5C6 0.223858 5.77614 0 5.5 0C5.22386 0 5 0.223858 5 0.5V5H0.5C0.223858 5 0 5.22386 0 5.5C0 5.77614 0.223858 6 0.5 6H5V10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5V6H10.5C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5H6V0.5Z"
                fill="#FFFFFF"
            />
        </svg>
    );
}

export function renderNavigationTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    addedLibraries: string[],
    handleAddLibrary: (libraryId: string) => void,
    handleNavigationTabsVisibility: (navigationId: any) => void
): React.ReactNode {
    return (
        <fast-tabs
            activeId={activeId}
            events={{
                change: (e: React.ChangeEvent<HTMLElement>) => {
                    if ((e as any).detail) {
                        handleNavigationTabsVisibility((e as any).detail.id);
                    }
                },
            }}
        >
            <fast-tab id={NavigationId.navigation}>Navigation</fast-tab>
            <fast-tab id={NavigationId.libraries}>Libraries</fast-tab>
            <fast-tab-panel id={NavigationId.navigation + "Panel"}>
                <ModularNavigation
                    messageSystem={fastMessageSystem}
                    types={[DataType.object]}
                    defaultLinkedDataDroppableDataLocation={"Slot"}
                    droppableBlocklist={voidElements}
                    scrollIntoView={true}
                />
            </fast-tab-panel>
            <fast-tab-panel id={NavigationId.libraries + "Panel"}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "10px",
                        rowGap: "10px",
                    }}
                >
                    {Object.values(elementLibraries).map(elementLibrary => {
                        if (elementLibrary.optional) {
                            const isIncluded: boolean = addedLibraries.includes(
                                elementLibrary.id
                            );
                            return (
                                <fast-button
                                    key={elementLibrary.id}
                                    events={{
                                        click: (e: React.MouseEvent) => {
                                            handleAddLibrary(elementLibrary.id);
                                        },
                                    }}
                                    disabled={isIncluded}
                                >
                                    <span slot="start">
                                        {renderStartIcon(isIncluded)}
                                    </span>
                                    {elementLibrary.displayName}
                                </fast-button>
                            );
                        }
                    })}
                </div>
            </fast-tab-panel>
        </fast-tabs>
    );
}
