import { memoize } from "lodash-es";
import rafThrottle from "raf-throttle";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import React from "react";
import {
    CustomMessageIncomingOutgoing,
    fastToolingColorPicker,
    htmlRenderOriginatorId,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemSchemaDictionaryTypeAction,
    MessageSystemType,
    monacoAdapterId,
    SchemaDictionary,
} from "@microsoft/fast-tooling";
import {
    ControlConfig,
    ControlType,
    defaultDevices,
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
import { DesignSystem } from "@microsoft/fast-foundation";
import {
    baseLayerLuminance,
    fastBadge,
    fastCheckbox,
    fastNumberField,
    fastOption,
    fastSelect,
    fastSlider,
    fastSliderLabel,
    fastTab,
    fastTabPanel,
    fastTabs,
    fastTextField,
    fillColor,
    StandardLuminance,
    SwatchRGB,
} from "@microsoft/fast-components";
import { LinkedDataActionType } from "@microsoft/fast-tooling-react/dist/form/templates/types";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import {
    findDictionaryIdByMonacoEditorHTMLPosition,
    findMonacoEditorHTMLPositionByDictionaryId,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/monaco";
import packageJson from "../package.json";
import {
    CreatorState,
    ExternalInitializingData,
    FormId,
    NavigationId,
    ProjectFile,
} from "./creator.props";
import { elementLibraries, elementLibraryContents } from "./configs";
import { divTag } from "./configs/native/library.native.tags";
import { ProjectFileTransfer } from "./components";
import {
    AccentColorPicker,
    Dimension,
    DirectionSwitch,
    Editor,
    Logo,
    nativeElementExtendedSchemas,
    textSchema,
    ThemeSelector,
} from "./site-utilities";
import { previewReady } from "./preview/constants";
import {
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
import { Device } from "./web-components/devices";
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

DesignSystem.getOrCreate().register(
    fastBadge(),
    fastCheckbox(),
    fastNumberField(),
    fastOption(),
    fastSelect(),
    fastSlider(),
    fastSliderLabel(),
    fastTabs(),
    fastTab(),
    fastTabPanel(),
    fastTextField(),
    fastToolingColorPicker({ prefix: "fast-tooling" })
);
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
const FASTInlineLogo = require("./site-utilities/statics/assets/fast-inline-logo.svg");
const schemaDictionaryWithNativeElements: SchemaDictionary = {
    ...nativeElementExtendedSchemas,
    [textSchema.$id]: textSchema,
};
const schemaDictionaryWithDesignTokens: SchemaDictionary = {
    ...schemaDictionaryWithNativeElements,
    [fluentDesignTokensSchema.id]: fluentDesignTokensSchema,
};

export const previewAccentColor: string = "PREVIEW::ACCENTCOLOR";
export const defaultElementDataId: string = "root";

class Creator extends Editor<{}, CreatorState> {
    public static displayName: string = "Creator";

    public viewerContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    public editorContainerRef: React.RefObject<HTMLDivElement> = React.createRef();
    private windowResizing: number;
    private devices: Device[];
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

        this.devices = this.getDevices();

        if ((window as any).Worker) {
            this.fastMessageSystem.add({ onMessage: this.handleMessageSystem });
            this.fastDesignMessageSystem.add({
                onMessage: this.handleDesignSystemMessageSystem,
            });
        }

        window.onresize = rafThrottle(this.handleWindowResize);
        window.addEventListener("message", this.handleWindowMessage);

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
            transparentBackground: false,
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
            <div>
                <WhatsNewDialog
                    userToolingVersion={this.state.userToolingVersion}
                    userToolingReactVersion={this.state.userToolingReactVersion}
                    userCreatorVersion={this.state.userCreatorVersion}
                    updateWhatsNewAvailability={this.updateWhatsNewAvailability}
                    showWhatsNew={this.state.showWhatsNewDialog}
                    updateWhatsNewVisibility={this.handleWhatsNewOverlay}
                />
                <div
                    className={this.getContainerClassNames()}
                    style={{
                        gridTemplateColumns:
                            this.state.displayMode === DisplayMode.interactive
                                ? undefined
                                : "0px auto 0px",
                    }}
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
                        <div style={{ height: "calc(100% - 48px)" }}>
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
                        <div className={this.menuBarClassNames}>
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
                                    style={{
                                        display: "flex",
                                        marginLeft: "auto",
                                    }}
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
                            className={classNames(
                                this.canvasContentClassNames,
                                [
                                    "canvas-content__dev-tools-hidden",
                                    !this.state.devToolsVisible,
                                ],
                                [
                                    "canvas-content__preview",
                                    this.state.displayMode === DisplayMode.preview,
                                ]
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
                                className={classNames("dev-tools", [
                                    "preview",
                                    this.state.displayMode === DisplayMode.preview,
                                ])}
                            >
                                <div
                                    ref={this.editorContainerRef}
                                    style={{ height: "100%", paddingTop: "24px" }}
                                />
                                {renderDevToolToggle(
                                    this.state.devToolsVisible,
                                    this.handleDevToolsToggle
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

    private handleWindowMessage = (e: MessageEvent): void => {
        if (e.data) {
            let messageData: XOR<null, ExternalInitializingData>;

            try {
                messageData = JSON.parse(e.data);
            } catch (e) {
                messageData = null;
            }
            if (
                messageData &&
                messageData.type === MessageSystemType.dataDictionary &&
                messageData.data
            ) {
                this.fastMessageSystem.postMessage({
                    type: MessageSystemType.initialize,
                    data: messageData.data,
                    schemaDictionary: schemaDictionaryWithNativeElements,
                });
            }
        }
    };

    private handleUpdateProjectFile = (projectFile: ProjectFile): void => {
        this.setState(projectFile, () =>
            this.fastMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                data: projectFile.dataDictionary,
                schemaDictionary: schemaDictionaryWithNativeElements,
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
    }

    private updateMonacoEditor = (): void => {
        this.createMonacoEditor(monaco, undefined, { fontSize: "16px" });

        if (this.editorContainerRef.current && this.editor) {
            this.editor.layout();
        }
    };

    private getDevices(): Device[] {
        return defaultDevices.concat({
            id: "desktop",
            displayName: "Desktop (1920x1080)",
            display: Display.fixed,
            width: 1920,
            height: 1080,
        });
    }

    private getDeviceById(id: string): Device | void {
        return this.devices.find((device: Device): boolean => {
            return device.id === id;
        });
    }

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
}

export default Creator;
