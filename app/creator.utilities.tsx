import React from "react";
import { MessageSystem, SchemaDictionary } from "@microsoft/fast-tooling";
import { classNames } from "@microsoft/fast-web-utilities";
// This is only used as a typescript reference, the actual monaco import must
// be passed from the derived class or it will cause import issues
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { defaultDevices, Device, Display } from "@microsoft/fast-tooling-react";
import { ElementLibraryDefinition } from "./configs/typings";
import { DisplayMode } from "./utilities";

abstract class CreatorUtilities<P, S> extends React.Component<P, S> {
    public editor: monaco.editor.IStandaloneCodeEditor;
    public abstract editorContainerRef: React.RefObject<HTMLDivElement>;
    public abstract viewerContainerRef: React.RefObject<HTMLDivElement>;
    public viewerContentAreaPadding: number = 20;
    public maxViewerHeight: number = 0;
    public maxViewerWidth: number = 0;
    public fastMessageSystem: MessageSystem;
    public fastDesignMessageSystem: MessageSystem;
    // This is the current monaco editor models string value
    public monacoValue: string[];
    public paneStartClassNames: string = "pane pane__start";
    public paneEndClassNames: string = "pane pane__end";
    public viewerClassNames: string = "preview";
    public canvasContentClassNames: string = "canvas-content";
    public canvasContentDevToolsHiddenModifierClassName: string =
        "canvas-content__devToolsHidden";
    public canvasContentPreviewModifierClassName: string = "canvas-content__preview";
    public canvasMenuBarClassNames: string = "canvasMenuBar";
    public mobileMenuBarClassNames: string = "mobileMenuBar";
    public logoClassNames: string = "logo";
    public navigationRegionClassNames: string = "navigationRegion";
    public canvasClassNames: string = "canvas";
    public menuBarRegionClassNames: string = "menuBarRegion";
    public editorRegionClassNames: string = "editorRegion";
    public canvasMenuBarConfigurationClassNames: string = "canvasMenuBar-configuration";
    public paneTriggerClassNames: string = "pane-trigger";
    public canvasOverlayClassNames: string = "canvas-overlay";
    public canvasOverlayActiveModifierClassName: string = "canvas-overlay__active";
    public containerClassNames: string = "container";
    public containerFormVisibleModifierClassName: string = "container__formVisible";
    public containerNavigationVisibleModifierClassName: string =
        "container__navigationVisible";
    public containerInteractiveModifierClassName: string = "container__interactive";
    public containerPreviewModifierClassName: string = "container__preview";
    public devToolsClassNames: string = "devTools";
    public devToolsPreviewModifierClassName: string = "devTools__preview";
    public devToolsToggleClassNames: string = "devToolsToggle";
    public whatsNewDialogClassNames: string = "whatsNew-dialog";
    public whatsNewVersionClassNames: string = "whatsNew-versions";
    public devices: Device[];

    constructor(props) {
        super(props);

        this.devices = this.getDevices();
    }

    public getLibrarySchemas(
        addedLibraries: string[],
        initialSchemaDictionary: SchemaDictionary,
        elementLibraries: { [key: string]: ElementLibraryDefinition }
    ): SchemaDictionary {
        const schemaDictionary: SchemaDictionary = initialSchemaDictionary;

        addedLibraries.forEach((libraryId: string) => {
            Object.values(elementLibraries[libraryId].componentDictionary).forEach(
                componentDictionaryItem => {
                    schemaDictionary[(componentDictionaryItem.schema as any).$id] =
                        componentDictionaryItem.schema;
                }
            );
        });

        return schemaDictionary;
    }

    public getDeviceById(id: string): Device | void {
        return this.devices.find((device: Device): boolean => {
            return device.id === id;
        });
    }

    public getDevices(): Device[] {
        return defaultDevices.concat({
            id: "desktop",
            displayName: "Desktop (1920x1080)",
            display: Display.fixed,
            width: 1920,
            height: 1080,
        });
    }

    public getContainerClassNames(
        mobileFormVisible: boolean,
        mobileNavigationVisible: boolean,
        displayMode: DisplayMode
    ): string {
        return classNames(
            this.containerClassNames,
            [this.containerFormVisibleModifierClassName, mobileFormVisible],
            [this.containerNavigationVisibleModifierClassName, mobileNavigationVisible],
            [
                this.containerInteractiveModifierClassName,
                displayMode === DisplayMode.interactive,
            ],
            [this.containerPreviewModifierClassName, displayMode === DisplayMode.preview]
        );
    }

    public getCanvasOverlayClassNames(
        mobileFormVisible: boolean,
        mobileNavigationVisible: boolean
    ): string {
        return classNames(this.canvasOverlayClassNames, [
            this.canvasOverlayActiveModifierClassName,
            mobileFormVisible || mobileNavigationVisible,
        ]);
    }

    public getDevToolsClassNames(displayMode: DisplayMode): string {
        return classNames(this.devToolsClassNames, [
            this.devToolsPreviewModifierClassName,
            displayMode === DisplayMode.preview,
        ]);
    }

    public getCanvasContentClassNames(
        devToolsVisible: boolean,
        displayMode: DisplayMode
    ): string {
        return classNames(
            this.canvasContentClassNames,
            [this.canvasContentDevToolsHiddenModifierClassName, !devToolsVisible],
            [
                this.canvasContentPreviewModifierClassName,
                displayMode === DisplayMode.preview,
            ]
        );
    }
}

export { CreatorUtilities };
