import React from "react";
import ReactDOM from "react-dom";
import { memoize } from "lodash-es";
import rafThrottle from "raf-throttle";
import { Direction } from "@microsoft/fast-web-utilities";
import { VSCodeNativeHTMLDefinition } from "@microsoft/fast-tooling/dist/esm/definitions/native/html-native.vs-code-v1.1-types";
import { html_beautify } from "vscode-html-languageservice/lib/esm/beautify/beautify-html";
import {
    AjvMapper,
    CustomMessageIncomingOutgoing,
    DataDictionary,
    htmlRenderOriginatorId,
    MessageSystem,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemType,
    MonacoAdapter,
    MonacoAdapterAction,
    MonacoAdapterActionCallbackConfig,
    monacoAdapterId,
    SchemaDictionary,
    Shortcuts,
    ShortcutsActionDelete,
    ShortcutsActionDuplicate,
    ShortcutsActionRedo,
    ShortcutsActionUndo,
} from "@microsoft/fast-tooling";
import {
    ControlConfig,
    ControlType,
    Display,
    LinkedDataControl,
    ModularViewer,
    StandardControlPlugin,
    ViewerCustomAction,
} from "@microsoft/fast-tooling-react";
import {
    ControlContext,
    ControlOnChangeConfig,
} from "@microsoft/fast-tooling-react/dist/form/templates/types";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {
    baseLayerLuminance,
    fillColor,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import { LinkedDataActionType } from "@microsoft/fast-tooling-react/dist/form/templates/types";
import {
    findDictionaryIdByMonacoEditorHTMLPosition,
    findMonacoEditorHTMLPositionByDictionaryId,
    mapDataDictionaryToMonacoEditorHTML,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/monaco";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import packageJson from "../package.json";
import { CreatorState, FormId, NavigationId, ProjectFile } from "./creator.props";
import { elementLibraries, elementLibraryContents } from "./configs";
import { divTag } from "./configs/native/library.native.tags";
import { AccentColorPicker, DirectionSwitch, ThemeSelector } from "./components";
import {
    nativeElementExtendedSchemas,
    textSchema,
} from "./configs/native/library.native.schemas";
import { previewReady } from "./preview/constants";
import {
    Dimension,
    Logo,
    ProjectFileTransfer,
    renderDeviceSelect,
    renderDevToolToggle,
    renderFormTabs,
    renderNavigationTabs,
    renderPreviewSwitch,
    userCreatorVersionKey,
    userToolingReactVersionKey,
    userToolingVersionKey,
    WhatsNewDialog,
} from "./web-components";
import { Device } from "./devices";
import fluentDesignTokensSchema from "./configs/fluent-ui/library.fluent-ui.design-tokens.schema.json";
import {
    creatorOriginatorId,
    CustomMessageSystemActions,
    designTokensLinkedDataId,
    DisplayMode,
    displayModeMessageInteractive,
    displayModeMessagePreview,
    previewOriginatorId,
    rootOriginatorId,
} from "./utilities";
import { fluentUIComponentId } from "./configs/fluent-ui";
import { WindowMessage } from "./window-message";
import { CreatorUtilities } from "./creator.utilities";

baseLayerLuminance.setValueFor(document.body, StandardLuminance.DarkMode);
fillColor.setValueFor(
    document.body,
    SwatchRGB.create(
        StandardLuminance.DarkMode,
        StandardLuminance.DarkMode,
        StandardLuminance.DarkMode
    )
);

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const FASTInlineLogo = require("./assets/fast-inline-logo.svg");
const schemaDictionaryWithNativeElements: SchemaDictionary = {
    ...nativeElementExtendedSchemas,
    [textSchema.$id]: textSchema,
};
const schemaDictionaryWithDesignTokens: SchemaDictionary = {
    ...schemaDictionaryWithNativeElements,
    [fluentDesignTokensSchema.id]: fluentDesignTokensSchema,
};

export const defaultElementDataId: string = "root";

const fastMessageSystemWorker = new FASTMessageSystemWorker();
const fastDesignMessageSystemWorker = new FASTMessageSystemWorker();

class Creator extends CreatorUtilities<{}, CreatorState> {
    public static displayName: string = "Creator";
    private adapter: MonacoAdapter;
    private monacoEditorModel: monaco.editor.ITextModel;
    private firstRun: boolean = true;
    private positionUpdateTimeout: XOR<number, NodeJS.Timer>;

    public rootContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    public viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    public editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private windowResizing: number;

    private linkedDataControl = new StandardControlPlugin({
        type: ControlType.linkedData,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            return (
                <LinkedDataControl
                    {...config}
                    onChange={this.handleLinkedDataUpdates(config.onChange)}
                />
            );
        },
    });

    private handleDimensionChange: (
        cb: (value: number) => void
    ) => React.ChangeEventHandler<HTMLInputElement> = memoize(
        (cb: (value: number) => void): React.ChangeEventHandler<HTMLInputElement> => {
            return (e: React.ChangeEvent<HTMLInputElement>): void => {
                const value: number = parseInt(e.target.value, 10);

                if (!isNaN(value)) {
                    cb(value);
                }
            };
        }
    );

    constructor(props: {}) {
        super(props);

        if ((window as any).Worker) {
            this.fastMessageSystem = new MessageSystem({
                webWorker: fastMessageSystemWorker,
            });
            this.fastDesignMessageSystem = new MessageSystem({
                webWorker: fastDesignMessageSystemWorker,
            });
            new AjvMapper({
                messageSystem: this.fastDesignMessageSystem,
            });
            new AjvMapper({
                messageSystem: this.fastMessageSystem,
            });
        }

        this.monacoValue = [];

        this.adapter = new MonacoAdapter({
            messageSystem: this.fastMessageSystem,
            actions: [
                new MonacoAdapterAction({
                    id: "monaco.setValue",
                    action: (config: MonacoAdapterActionCallbackConfig): void => {
                        // trigger an update to the monaco value that
                        // also updates the DataDictionary which fires a
                        // postMessage to the MessageSystem if the update
                        // is coming from Monaco and not a data dictionary update
                        config.updateMonacoModelValue(
                            [html_beautify(this.monacoValue.join(""))],
                            this.state.lastMappedDataDictionaryToMonacoEditorHTMLValue ===
                                this.monacoValue[0]
                        );
                    },
                }),
            ],
        });

        if ((window as any).Worker) {
            this.fastMessageSystem.add({ onMessage: this.handleMessageSystem });
            this.fastDesignMessageSystem.add({
                onMessage: this.handleDesignSystemMessageSystem,
            });
        }

        window.onresize = rafThrottle(this.handleWindowResize);
        new WindowMessage({
            messageSystem: this.fastMessageSystem,
            schemaDictionary: schemaDictionaryWithNativeElements,
            addLibraryCallback: this.handleAddLibrary,
        });

        this.setupMonacoEditor(monaco);

        this.state = {
            xCoord: 0,
            yCoord: 0,
            viewerWidth: 0,
            viewerHeight: 0,
            deviceId: this.devices[0].id,
            theme: StandardLuminance.LightMode,
            direction: Direction.ltr,
            accentColor: "",
            activeDictionaryId: defaultElementDataId,
            previewReady: false,
            devToolsVisible: true,
            mobileFormVisible: false,
            mobileNavigationVisible: false,
            activeFormId: FormId.component,
            activeNavigationId: NavigationId.navigation,
            addedLibraries: [],
            designSystemDataDictionary: [
                {
                    [designTokensLinkedDataId]: {
                        schemaId: fluentDesignTokensSchema.$id,
                        data: {
                            direction: Direction.ltr,
                            theme: StandardLuminance.LightMode,
                        },
                    },
                },
                designTokensLinkedDataId,
            ],
            dataDictionary: [
                {
                    [defaultElementDataId]: {
                        schemaId: divTag,
                        data: {},
                    },
                },
                defaultElementDataId,
            ],
            schemaDictionary: schemaDictionaryWithNativeElements,
            lastMappedDataDictionaryToMonacoEditorHTMLValue: "",
            displayMode: DisplayMode.interactive,
            whatsNewAvailable: false,
            showWhatsNewDialog: false,
            userToolingVersion: localStorage.getItem(userToolingVersionKey),
            userToolingReactVersion: localStorage.getItem(userToolingReactVersionKey),
            userCreatorVersion: localStorage.getItem(userCreatorVersionKey),
        };
    }

    public render(): React.ReactNode {
        const accentColor: string = (this.state.designSystemDataDictionary[0][
            designTokensLinkedDataId
        ].data as any)["accent-base-color"];
        const direction: Direction = (this.state.designSystemDataDictionary[0][
            designTokensLinkedDataId
        ].data as any)["direction"];

        return (
            <div ref={this.rootContainerRef}>
                <WhatsNewDialog
                    userToolingVersion={this.state.userToolingVersion}
                    userToolingReactVersion={this.state.userToolingReactVersion}
                    userCreatorVersion={this.state.userCreatorVersion}
                    updateWhatsNewAvailability={this.updateWhatsNewAvailability}
                    showWhatsNew={this.state.showWhatsNewDialog}
                    updateWhatsNewVisibility={this.handleWhatsNewOverlay}
                    dialogClassName={this.whatsNewDialogClassNames}
                    versionClassName={this.whatsNewVersionClassNames}
                />
                <div
                    className={this.getContainerClassNames(
                        this.state.mobileFormVisible,
                        this.state.mobileNavigationVisible,
                        this.state.displayMode
                    )}
                >
                    <div className={this.paneStartClassNames}>
                        <Logo
                            className={this.logoClassNames}
                            logo={FASTInlineLogo}
                            title={"Creator"}
                            version={packageJson.version}
                            handleWhatsNewOverlay={
                                this.state.whatsNewAvailable
                                    ? this.handleWhatsNewOverlay
                                    : null
                            }
                            whatsNewAvailable={this.state.whatsNewAvailable}
                        />
                        <div className={this.navigationRegionClassNames}>
                            {renderNavigationTabs(
                                this.state.activeNavigationId,
                                this.fastMessageSystem,
                                this.state.addedLibraries,
                                this.handleAddLibrary,
                                this.handleNavigationVisibility
                            )}
                        </div>
                        <ProjectFileTransfer
                            projectFile={this.state}
                            onUpdateProjectFile={this.handleUpdateProjectFile}
                        />
                    </div>
                    <div className={this.canvasClassNames}>
                        {this.renderCanvasOverlay()}
                        <div className={this.menuBarRegionClassNames}>
                            <div className={this.mobileMenuBarClassNames}>
                                {this.renderMobileNavigationTrigger()}
                                <Logo
                                    logo={FASTInlineLogo}
                                    handleWhatsNewOverlay={null}
                                    whatsNewAvailable={false}
                                />
                                {this.renderMobileFormTrigger()}
                            </div>
                            <div className={this.canvasMenuBarClassNames}>
                                {renderDeviceSelect(
                                    this.state.deviceId,
                                    this.handleUpdateDevice,
                                    !this.state.previewReady
                                )}
                                <Dimension
                                    width={this.state.viewerWidth}
                                    height={this.state.viewerHeight}
                                    onUpdateWidth={this.onUpdateWidth}
                                    onUpdateHeight={this.onUpdateHeight}
                                    onUpdateOrientation={this.handleUpdateOrientation}
                                    onDimensionChange={this.handleDimensionChange}
                                    disabled={!this.state.previewReady}
                                />
                                <div
                                    className={this.canvasMenuBarConfigurationClassNames}
                                >
                                    {renderPreviewSwitch(
                                        this.state.displayMode === DisplayMode.preview,
                                        this.handlePreviewModeSwitch,
                                        !this.state.previewReady
                                    )}
                                    <ThemeSelector
                                        id={"theme-selector"}
                                        theme={this.state.theme}
                                        onUpdateTheme={this.handleUpdateTheme}
                                        disabled={!this.state.previewReady}
                                    />
                                    <DirectionSwitch
                                        id={"direction-switch"}
                                        direction={direction}
                                        onUpdateDirection={this.handleUpdateDirection}
                                        disabled={!this.state.previewReady}
                                    />
                                    <AccentColorPicker
                                        id={"accent-color-picker"}
                                        accentBaseColor={
                                            accentColor !== undefined
                                                ? accentColor
                                                : fluentDesignTokensSchema?.properties?.[
                                                      "accent-base-color"
                                                  ]?.default
                                        }
                                        onAccentColorPickerChange={
                                            this.handleAccentColorPickerChange
                                        }
                                        disabled={!this.state.previewReady}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={this.getCanvasContentClassNames(
                                this.state.devToolsVisible,
                                this.state.displayMode
                            )}
                        >
                            <div
                                ref={this.viewerContainerRef}
                                className={this.viewerClassNames}
                                style={{
                                    padding: `${this.viewerContentAreaPadding}px`,
                                }}
                            >
                                <ModularViewer
                                    iframeSrc={"/preview"}
                                    messageSystem={this.fastMessageSystem}
                                    width={this.state.viewerWidth}
                                    height={this.state.viewerHeight}
                                    onUpdateHeight={this.onUpdateHeight}
                                    onUpdateWidth={this.onUpdateWidth}
                                    responsive={true}
                                    preview={
                                        this.state.displayMode === DisplayMode.preview
                                    }
                                />
                            </div>
                            <div
                                className={this.getDevToolsClassNames(
                                    this.state.displayMode
                                )}
                            >
                                <div
                                    ref={this.editorContainerRef}
                                    className={this.editorRegionClassNames}
                                />
                                {renderDevToolToggle(
                                    this.state.devToolsVisible,
                                    this.handleDevToolsToggle,
                                    this.devToolsToggleClassNames
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={this.paneEndClassNames}>
                        {renderFormTabs(
                            this.state.activeFormId,
                            this.fastMessageSystem,
                            this.fastDesignMessageSystem,
                            this.linkedDataControl,
                            this.handleFormVisibility,
                            this.updateDesignSystemDataDictionaryState
                        )}
                    </div>
                </div>
            </div>
        );
    }

    private handleNavigationVisibility = (navigationId): void => {
        this.setState({
            activeNavigationId: navigationId,
        });
    };

    private handleFormVisibility = (formId): void => {
        this.setState({
            activeFormId: formId,
        });
    };

    private handleAddLibrary = (libraryId: string) => {
        this.fastMessageSystem.postMessage({
            type: MessageSystemType.custom,
            action: ViewerCustomAction.call,
            options: {
                originatorId: rootOriginatorId,
            },
            data: {
                action: CustomMessageSystemActions.libraryAdd,
                id: libraryId,
            },
        } as CustomMessageIncomingOutgoing<any>);
    };

    private handleLibraryAdded = (libraryId: string): void => {
        this.setState(
            {
                addedLibraries: this.state.addedLibraries.concat([libraryId]),
            },
            () => {
                this.updateMonacoEditorHTMLElementDefinitions(
                    monaco,
                    this.state.addedLibraries.map((id: string) => {
                        return elementLibraries[id].customData;
                    })
                );
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.schemaDictionary,
                    action: MessageSystemSchemaDictionaryTypeAction.add,
                    schemas: Object.values(
                        elementLibraries[libraryId].componentDictionary
                    ).map(componentDictionaryItem => {
                        return componentDictionaryItem.schema;
                    }),
                });
            }
        );
    };

    private updateWhatsNewAvailability = (whatsNewAvailable: boolean): void => {
        this.setState({
            whatsNewAvailable,
        });
    };

    private handleWhatsNewOverlay = (): void => {
        this.setState({
            showWhatsNewDialog: !this.state.showWhatsNewDialog,
        });
    };

    private handleLinkedDataUpdates = (
        onChange
    ): ((e: ControlOnChangeConfig) => void) => {
        return (e: ControlOnChangeConfig): void => {
            Object.entries(elementLibraryContents).forEach(
                ([elementLibraryId, schemaIds]: [string, string[]]) => {
                    if (
                        e.linkedDataAction === LinkedDataActionType.add &&
                        schemaIds.includes(e.value[0].schemaId)
                    ) {
                        onChange({
                            ...e,
                            value:
                                [
                                    elementLibraries[elementLibraryId]
                                        .componentDictionary[e.value[0].schemaId].example,
                                ] || e.value,
                        });
                    } else if (
                        e.linkedDataAction === LinkedDataActionType.remove ||
                        e.linkedDataAction === LinkedDataActionType.reorder
                    ) {
                        onChange(e);
                    }
                }
            );
        };
    };

    public handleCanvasOverlayTrigger = (): void => {
        this.setState({
            mobileFormVisible: false,
            mobileNavigationVisible: false,
        });
    };

    public handleMobileNavigationTrigger = (): void => {
        this.setState({
            mobileNavigationVisible: true,
        });
    };

    public handleMobileFormTrigger = (): void => {
        this.setState({
            mobileFormVisible: true,
        });
    };

    public handleUpdateHeight = (updatedHeight: number): void => {
        this.setState({
            viewerHeight:
                updatedHeight > this.maxViewerHeight
                    ? this.maxViewerHeight
                    : updatedHeight,
        });
    };

    public handleUpdateWidth = (updatedWidth: number): void => {
        this.setState({
            viewerWidth:
                updatedWidth > this.maxViewerWidth ? this.maxViewerWidth : updatedWidth,
        });
    };

    private handleMessageSystem = (e: MessageEvent): void => {
        const updatedState: Partial<CreatorState> = {};
        if (
            e.data.type === MessageSystemType.custom &&
            e.data.action === ViewerCustomAction.response
        ) {
            if (
                e.data &&
                e.data.options &&
                e.data.options.originatorId === previewOriginatorId
            ) {
                this.handleLibraryAdded(e.data.data.id);
            } else if (e.data.value && e.data.value === previewReady) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.dataDictionary,
                    schemaDictionary: schemaDictionaryWithNativeElements,
                });
                this.fastDesignMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.designSystemDataDictionary,
                    schemaDictionary: schemaDictionaryWithDesignTokens,
                });
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.custom,
                    originatorId: designTokensLinkedDataId,
                    data: this.state.designSystemDataDictionary[0][
                        designTokensLinkedDataId
                    ].data,
                } as CustomMessageIncomingOutgoing<any>);
                updatedState.previewReady = true;
                this.updateEditorContent(this.state.dataDictionary);
                this.handleAddLibrary(fluentUIComponentId);
            } else if (e.data.value) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId:
                        e.data.value === "" ? this.state.dataDictionary[1] : e.data.value,
                    activeNavigationConfigId: "",
                    options: {
                        originatorId: htmlRenderOriginatorId,
                    },
                });
            } else if (e.data.data || e.data.data === "") {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.data,
                    action: MessageSystemDataTypeAction.update,
                    data: e.data.data,
                    dictionaryId: e.data.dictionaryId,
                    dataLocation: "",
                    options: {
                        originatorId: htmlRenderOriginatorId,
                    },
                });
            }
        }

        if (
            e.data.type === MessageSystemType.data ||
            e.data.type === MessageSystemType.initialize
        ) {
            updatedState.dataDictionary = e.data.dataDictionary;

            if (!e.data.options || e.data.options.originatorId !== monacoAdapterId) {
                this.updateEditorContent(e.data.dataDictionary);
            }
        }

        if (e.data.type === MessageSystemType.schemaDictionary) {
            updatedState.schemaDictionary = e.data.schemaDictionary;
        }

        if (e.data.type === MessageSystemType.navigation) {
            this.setState(
                {
                    activeDictionaryId: e.data.dictionaryId || e.data.activeDictionaryId,
                },
                () => {
                    const currentDictionaryId = findDictionaryIdByMonacoEditorHTMLPosition(
                        this.editor.getPosition(),
                        this.state.dataDictionary,
                        this.state.schemaDictionary,
                        this.monacoValue[0].split("\n")
                    );

                    if (currentDictionaryId !== this.state.activeDictionaryId) {
                        const position = findMonacoEditorHTMLPositionByDictionaryId(
                            e.data.dictionaryId || e.data.activeDictionaryId,
                            this.state.dataDictionary,
                            this.state.schemaDictionary,
                            this.monacoValue[0].split("\n")
                        );
                        this.editor.setPosition(position);
                        this.editor.revealPositionInCenter(position, 0);
                    }
                }
            );
        }

        this.setState(updatedState as CreatorState);
    };

    private handleDesignSystemMessageSystem = (e: MessageEvent): void => {
        if (e.data.type === MessageSystemType.data) {
            this.updateDesignSystemDataDictionaryState(e.data.data);
        }
    };

    private handleUpdateProjectFile = (projectFile: ProjectFile): void => {
        this.setState(projectFile, () =>
            this.fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: projectFile.dataDictionary,
                schemaDictionary: this.getLibrarySchemas(
                    projectFile.addedLibraries,
                    schemaDictionaryWithNativeElements,
                    elementLibraries
                ),
            })
        );
    };

    private handleWindowResize = (): void => {
        if (this.editorContainerRef.current) {
            if (this.windowResizing) {
                clearTimeout(this.windowResizing);
            }

            this.windowResizing = window.setTimeout(() => {
                const device: Device | void = this.getDeviceById(this.state.deviceId);
                if (device && device.display === Display.responsive) {
                    this.setState({
                        viewerWidth: 0,
                        viewerHeight: 0,
                    });

                    this.setViewerToFullSize();
                }
                this.updateMonacoEditor();
            });
        }
    };

    public componentDidMount(): void {
        this.setViewerToFullSize();
        this.updateMonacoEditor();

        /**
         * Setup the Shortcuts
         */
        new Shortcuts({
            messageSystem: this.fastMessageSystem,
            target: this.rootContainerRef.current as HTMLDivElement,
            actions: [
                ShortcutsActionDelete(this.fastMessageSystem),
                ShortcutsActionDuplicate(this.fastMessageSystem),
                ShortcutsActionRedo(this.fastMessageSystem),
                ShortcutsActionUndo(this.fastMessageSystem),
            ],
        });
    }

    private updateMonacoEditor = (): void => {
        this.createMonacoEditor(monaco, undefined, { fontSize: "16px" });

        if (this.editorContainerRef.current && this.editor) {
            this.editor.layout();
        }
    };

    private handleUpdateDevice = (deviceId: string): void => {
        const device: Device | void = this.getDeviceById(deviceId);

        if (device) {
            if (
                device.display === Display.responsive &&
                this.state.deviceId !== Display.responsive
            ) {
                // if we are changing from a fixed device to response then trigger a window resize event
                // to reset the size of the viewer.
                this.setState(
                    {
                        deviceId,
                    },
                    () => {
                        this.handleWindowResize();
                    }
                );
            } else {
                const viewerHeight: number = device.height as number;
                const viewerWidth: number = device.width as number;
                this.setState({
                    deviceId,
                    viewerHeight,
                    viewerWidth,
                });
            }
        }
    };

    private handleUpdateOrientation = (): void => {
        this.setState({
            viewerWidth: this.state.viewerHeight,
            viewerHeight: this.state.viewerWidth,
        });
    };

    private setResponsiveDeviceId(): void {
        const activeDevice: Device | void = this.getDeviceById(this.state.deviceId);
        if (activeDevice && activeDevice.display !== Display.responsive) {
            this.setState({
                deviceId: Display.responsive,
            });
        }
    }

    public onUpdateHeight = (viewerHeight: number): void => {
        this.setResponsiveDeviceId();
        this.handleUpdateHeight(viewerHeight);
    };

    public onUpdateWidth = (viewerWidth: number): void => {
        this.setResponsiveDeviceId();
        this.handleUpdateWidth(viewerWidth);
    };

    private updateDesignSystemDataDictionaryState = (newData: {
        [key: string]: unknown;
    }): void => {
        this.setState(
            {
                designSystemDataDictionary: [
                    {
                        [designTokensLinkedDataId]: {
                            schemaId: this.state.designSystemDataDictionary[0][
                                designTokensLinkedDataId
                            ].schemaId,
                            data: {
                                ...(this.state.designSystemDataDictionary[0][
                                    designTokensLinkedDataId
                                ] as any).data,
                                ...newData,
                            },
                        },
                    },
                    designTokensLinkedDataId,
                ],
            },
            () => {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.custom,
                    originatorId: designTokensLinkedDataId,
                    data: this.state.designSystemDataDictionary[0][
                        designTokensLinkedDataId
                    ].data,
                } as CustomMessageIncomingOutgoing<any>);
                this.fastDesignMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    dataDictionary: this.state.designSystemDataDictionary,
                    schemaDictionary: schemaDictionaryWithDesignTokens,
                });
            }
        );
    };

    /**
     * Event handler for accent color input changes
     */
    private handleAccentColorPickerChange = (
        e: React.FormEvent<HTMLInputElement>
    ): void => {
        const value: string = e.currentTarget.value;
        this.updateDesignSystemDataDictionaryState({ "accent-base-color": value });
    };

    /**
     * Event handler for theme changes
     */
    public handleUpdateTheme = (): void => {
        const updatedTheme: StandardLuminance =
            this.state.theme === StandardLuminance.DarkMode
                ? StandardLuminance.LightMode
                : StandardLuminance.DarkMode;

        this.setState({
            theme: updatedTheme,
        });

        this.updateDesignSystemDataDictionaryState({
            theme: updatedTheme,
        });
    };

    /**
     * Event handler for direction changes
     */
    public handleUpdateDirection = (): void => {
        const updatedDirection: Direction =
            (this.state.designSystemDataDictionary[0][designTokensLinkedDataId]
                .data as any)["direction"] === Direction.ltr
                ? Direction.rtl
                : Direction.ltr;

        this.updateDesignSystemDataDictionaryState({ direction: updatedDirection });
    };

    /**
     * Handle the visibility of the dev tools
     * which contains the code editor
     */
    private handleDevToolsToggle = (): void => {
        this.setState(
            {
                devToolsVisible: !this.state.devToolsVisible,
            },
            () => {
                const device: Device | void = this.getDeviceById(this.state.deviceId);
                if (device && device.display === Display.responsive) {
                    this.setViewerToFullSize();
                }
                this.updateMonacoEditor();
            }
        );
    };

    /**
     * Handle the preview mode switch change event
     * @param newState - The new state of the switch
     */
    private handlePreviewModeSwitch = (newState: boolean): void => {
        this.setState(
            {
                displayMode: newState ? DisplayMode.preview : DisplayMode.interactive,
            },
            () => {
                // Send message
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.custom,
                    options: {
                        originatorId: creatorOriginatorId,
                        action: newState
                            ? displayModeMessagePreview
                            : displayModeMessageInteractive,
                    },
                });
                this.handleWindowResize();
            }
        );
    };

    public setupMonacoEditor = (monacoRef: any): void => {
        monacoRef.editor.onDidCreateModel((listener: monaco.editor.ITextModel) => {
            this.monacoEditorModel = monacoRef.editor.getModel(
                listener.uri
            ) as monaco.editor.ITextModel;

            this.monacoEditorModel.onDidChangeContent(
                (e: monaco.editor.IModelContentChangedEvent) => {
                    /**
                     * Sets the value to be used by monaco
                     */
                    if (this.state.previewReady) {
                        const modelValue = this.monacoEditorModel.getValue();
                        this.monacoValue = Array.isArray(modelValue)
                            ? modelValue
                            : [modelValue];

                        if (!this.firstRun) {
                            this.adapter.action("monaco.setValue").run();
                        }

                        this.firstRun = false;
                    }
                }
            );
        });
    };

    public updateMonacoEditorHTMLElementDefinitions = (
        monacoRef: any,
        componentDefinitions: VSCodeNativeHTMLDefinition[]
    ): void => {
        monacoRef.languages.html.htmlDefaults.setOptions({
            data: {
                useDefaultDataProvider: false,
                dataProviders: componentDefinitions,
            },
        });
    };

    public createMonacoEditor = (
        monacoRef: any,
        alternateContainerRef?: HTMLElement,
        editorOptions?: any
    ): void => {
        if ((alternateContainerRef || this.editorContainerRef.current) && !this.editor) {
            this.editor = monacoRef.editor.create(
                alternateContainerRef
                    ? alternateContainerRef
                    : this.editorContainerRef.current,
                {
                    value: "",
                    language: "html",
                    formatOnPaste: true,
                    lineNumbers: "off",
                    theme: "vs-dark",
                    wordWrap: "on",
                    wordWrapColumn: 80,
                    wordWrapMinified: true,
                    wrappingIndent: "same",
                    minimap: {
                        showSlider: "mouseover",
                    },
                    ...editorOptions,
                }
            );
            this.editor.onDidChangeCursorPosition(
                (e: monaco.editor.ICursorPositionChangedEvent): void => {
                    if (this.positionUpdateTimeout) {
                        clearTimeout(this.positionUpdateTimeout as number);
                    }

                    this.positionUpdateTimeout = setTimeout(
                        this.updateNavigation.bind(this, e),
                        500
                    );
                }
            );

            this.updateEditorContent(this.state.dataDictionary);
        }
    };

    public updateNavigation(e: monaco.editor.ICursorPositionChangedEvent) {
        if (e.reason === 3 && Array.isArray(this.monacoValue) && this.monacoValue[0]) {
            const dictionaryId = findDictionaryIdByMonacoEditorHTMLPosition(
                e.position,
                this.state.dataDictionary,
                this.state.schemaDictionary,
                this.monacoValue[0].split("\n")
            );

            if (dictionaryId !== this.state.activeDictionaryId) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: dictionaryId,
                    activeNavigationConfigId: "",
                    options: {
                        originatorId: rootOriginatorId,
                    },
                });
            }
        }
    }

    public updateEditorContent(dataDictionary: DataDictionary<unknown>): void {
        if (this.editor) {
            const lastMappedDataDictionaryToMonacoEditorHTMLValue = html_beautify(
                mapDataDictionaryToMonacoEditorHTML(
                    dataDictionary,
                    this.state.schemaDictionary
                )
            );

            this.setState(
                {
                    lastMappedDataDictionaryToMonacoEditorHTMLValue,
                },
                () => {
                    this.editor.setValue(lastMappedDataDictionaryToMonacoEditorHTMLValue);
                }
            );
        }
    }

    public setViewerToFullSize(alternateContainerRef?: HTMLElement): void {
        const viewerContainer: HTMLElement | null = alternateContainerRef
            ? alternateContainerRef
            : this.viewerContainerRef.current;

        if (viewerContainer) {
            /* eslint-disable-next-line react/no-find-dom-node */
            const viewerNode: Element | Text | null = ReactDOM.findDOMNode(
                viewerContainer
            );

            if (viewerNode instanceof Element) {
                // 24 is height of view label
                this.maxViewerHeight =
                    viewerNode.clientHeight - this.viewerContentAreaPadding * 2 - 24;
                this.maxViewerWidth =
                    viewerNode.clientWidth - this.viewerContentAreaPadding * 2;

                this.setState({
                    viewerWidth: this.maxViewerWidth,
                    viewerHeight: this.maxViewerHeight,
                });
            }
        }
    }

    public renderCanvasOverlay(): React.ReactNode {
        return (
            <div
                className={this.getCanvasOverlayClassNames(
                    this.state.mobileFormVisible,
                    this.state.mobileNavigationVisible
                )}
                onClick={this.handleCanvasOverlayTrigger}
            ></div>
        );
    }

    public renderMobileNavigationTrigger(): React.ReactNode {
        return (
            <button
                className={this.paneTriggerClassNames}
                onClick={this.handleMobileNavigationTrigger}
            >
                <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="16" height="1" rx="0.5" fill="white" />
                    <rect y="7" width="16" height="1" rx="0.5" fill="white" />
                    <rect y="14" width="16" height="1" rx="0.5" fill="white" />
                </svg>
            </button>
        );
    }

    public renderMobileFormTrigger(): React.ReactNode {
        return (
            <button
                className={this.paneTriggerClassNames}
                onClick={this.handleMobileFormTrigger}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16.5253 1.47498C17.6898 2.63953 17.6898 4.52764 16.5253 5.69219L6.55167 15.6658C6.32095 15.8965 6.034 16.0631 5.71919 16.1489L1.45612 17.3116C0.989558 17.4388 0.56145 17.0107 0.688694 16.5441L1.85135 12.2811C1.93721 11.9663 2.10373 11.6793 2.33446 11.4486L12.3081 1.47498C13.4726 0.310424 15.3607 0.310424 16.5253 1.47498ZM11.5001 4.05073L3.21834 12.3325C3.14143 12.4094 3.08592 12.505 3.05731 12.61L2.18243 15.8178L5.3903 14.943C5.49523 14.9143 5.59088 14.8588 5.66779 14.7819L13.9493 6.4999L11.5001 4.05073ZM13.1919 2.35886L12.3835 3.16656L14.8326 5.61656L15.6414 4.80831C16.3178 4.13191 16.3178 3.03526 15.6414 2.35886C14.965 1.68246 13.8683 1.68246 13.1919 2.35886Z"
                        fill="white"
                    />
                </svg>
            </button>
        );
    }
}

export default Creator;
