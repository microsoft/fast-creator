import { observable } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import {
    DataDictionary,
    DataMessageOutgoing,
    htmlRenderOriginatorId,
    InitializeMessageOutgoing,
    MessageSystem,
    MessageSystemNavigationTypeAction,
    MessageSystemOutgoing,
    MessageSystemType,
    NavigationMessageOutgoing,
    RemoveLinkedDataDataMessageOutgoing,
    SchemaDictionary,
    UpdateDataMessageIncoming,
} from "@microsoft/fast-tooling";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { ViewerCustomAction } from "@microsoft/fast-tooling-react";
import { HTMLRender } from "@microsoft/fast-tooling/dist/dts/web-components/html-render/html-render";
import { Direction } from "@microsoft/fast-web-utilities";
import {
    fastComponentDefinitions,
    fluentUIComponentDefinitions,
    nativeElementDefinitions,
} from "../../../site-utilities";
import {
    creatorOriginatorId,
    CustomMessageSystemActions,
    designTokensLinkedDataId,
    DisplayMode,
    displayModeMessageInteractive,
    displayModeMessagePreview,
    previewOriginatorId,
} from "../../../utilities";
import { mapFluentUIComponentsDesignSystem } from "../../../configs/fluent-ui/library.fluent-ui.design-system.mapping";
import { elementLibraries } from "../../../configs";
import { WebComponentLibraryDefinition } from "../../../configs/typings";
import { previewReady } from "../../constants";

export class Preview extends FoundationElement {
    @observable
    public displayMode: DisplayMode;

    @observable
    public direction: Direction;

    /**
     * A reference to the internal input element
     * @internal
     */
    public renderRef: HTMLRender;

    private htmlRenderMessageSystemWorker = new FASTMessageSystemWorker();
    private activeDictionaryId: string;
    private dataDictionary: DataDictionary<unknown> | void;
    private schemaDictionary: SchemaDictionary;
    private designSystemDataDictionary: DataDictionary<unknown> | void;
    private htmlRenderMessageSystem: MessageSystem;
    private htmlRenderReady: boolean;

    constructor() {
        super();
        this.direction = Direction.ltr;
        this.activeDictionaryId = "";
        this.dataDictionary = void 0;
        this.schemaDictionary = {};
        this.designSystemDataDictionary = void 0;
        this.htmlRenderMessageSystem = new MessageSystem({
            webWorker: this.htmlRenderMessageSystemWorker,
        });
        this.htmlRenderReady = false;
        this.displayMode = DisplayMode.interactive;

        this.htmlRenderMessageSystem.add({
            onMessage: this.handleHtmlMessageSystem,
        });

        window.addEventListener("message", this.handleMessage);
    }

    connectedCallback() {
        super.connectedCallback();
        window.postMessage(
            {
                type: MessageSystemType.custom,
                action: ViewerCustomAction.call,
                value: previewReady,
            },
            "*"
        );
    }

    /**
     * Sets up the DOM with quick exit cases
     * if another request is performed.
     */
    private attachMappedComponents(): void {
        if (this.renderRef !== null && !this.htmlRenderReady) {
            (this.renderRef as any).messageSystem = this.htmlRenderMessageSystem;
            (this.renderRef as any).markupDefinitions = {
                ...fastComponentDefinitions,
                ...fluentUIComponentDefinitions,
                ...nativeElementDefinitions,
            };
            this.htmlRenderReady = true;
        }

        if (this.dataDictionary !== undefined && this.renderRef !== null) {
            if (
                this.designSystemDataDictionary &&
                (this.designSystemDataDictionary[0][designTokensLinkedDataId].data as any)
            ) {
                // TODO: investigate the use of multiple design systems
                // or determine how to register namespaced design tokens
                mapFluentUIComponentsDesignSystem(
                    document.body,
                    this.designSystemDataDictionary[0][designTokensLinkedDataId]
                        .data as any
                );
            }

            // Update the direction
            this.direction =
                this.designSystemDataDictionary &&
                (this.designSystemDataDictionary[0][designTokensLinkedDataId]
                    .data as any) &&
                (this.designSystemDataDictionary[0][designTokensLinkedDataId]
                    .data as any)["direction"]
                    ? (this.designSystemDataDictionary[0][designTokensLinkedDataId]
                          .data as any)["direction"]
                    : Direction.ltr;
        }
    }

    private attachComponentsAndInit(): void {
        this.attachMappedComponents();
        if (this.dataDictionary !== undefined) {
            this.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.initialize,
                dataDictionary: this.dataDictionary,
                schemaDictionary: this.schemaDictionary,
            });
            if (this.activeDictionaryId) {
                this.htmlRenderMessageSystem.postMessage({
                    type: MessageSystemType.navigation,
                    action: MessageSystemNavigationTypeAction.update,
                    activeDictionaryId: this.activeDictionaryId,
                    options: {
                        originatorId: "preview",
                    },
                    activeNavigationConfigId: "",
                });
            }
        }
    }

    private handleNavigation(): void {
        if (this.renderRef !== null) {
            this.htmlRenderMessageSystem.postMessage({
                type: MessageSystemType.navigation,
                action: MessageSystemNavigationTypeAction.update,
                activeDictionaryId: this.activeDictionaryId,
                options: {
                    originatorId: "preview",
                },
                activeNavigationConfigId: "",
            });
        }
    }

    private updateDOM(messageData: MessageSystemOutgoing): void {
        switch (messageData.type) {
            case MessageSystemType.initialize:
            case MessageSystemType.custom:
            case MessageSystemType.data:
                if (
                    !(messageData as any).options ||
                    (messageData as any).options.originatorId !== htmlRenderOriginatorId
                )
                    this.attachComponentsAndInit();
            case MessageSystemType.navigation:
                if (
                    !(messageData as any).options ||
                    (messageData as any).options.originatorId !== htmlRenderOriginatorId
                )
                    this.handleNavigation();
        }
        this.attachMappedComponents();
    }

    private handleMessage = async (message: MessageEvent): Promise<void> => {
        if (message.origin === location.origin) {
            let messageData: unknown;

            try {
                messageData = JSON.parse(message.data);
            } catch (e) {
                return;
            }
            if (
                messageData !== undefined &&
                (!(messageData as any).options ||
                    ((messageData as any).options as any).originatorId !== "preview")
            ) {
                switch ((messageData as MessageSystemOutgoing).type) {
                    case MessageSystemType.initialize:
                        this.dataDictionary = (messageData as InitializeMessageOutgoing).dataDictionary;
                        this.schemaDictionary = (messageData as InitializeMessageOutgoing).schemaDictionary;
                        this.activeDictionaryId = (messageData as InitializeMessageOutgoing).activeDictionaryId;
                        this.updateDOM(messageData as MessageSystemOutgoing);
                        break;
                    case MessageSystemType.data: {
                        const dictionaryId: string | undefined =
                            typeof (messageData as RemoveLinkedDataDataMessageOutgoing)
                                .activeDictionaryId === "string"
                                ? (messageData as RemoveLinkedDataDataMessageOutgoing)
                                      .activeDictionaryId
                                : typeof (messageData as UpdateDataMessageIncoming)
                                      .dictionaryId === "string"
                                ? (messageData as UpdateDataMessageIncoming).dictionaryId
                                : undefined;
                        this.dataDictionary = (messageData as DataMessageOutgoing).dataDictionary;
                        if (dictionaryId) {
                            this.activeDictionaryId = dictionaryId;
                        }
                        this.updateDOM(messageData as MessageSystemOutgoing);
                        break;
                    }
                    case MessageSystemType.navigation:
                        if (
                            !(messageData as any).options ||
                            ((messageData as any).options as any).originatorId !==
                                htmlRenderOriginatorId
                        )
                            this.activeDictionaryId = (messageData as NavigationMessageOutgoing).activeDictionaryId;
                        this.updateDOM(messageData as MessageSystemOutgoing);
                        break;
                    case MessageSystemType.schemaDictionary:
                        this.schemaDictionary = (messageData as any).schemaDictionary;
                        break;
                    case MessageSystemType.custom:
                        if (
                            (messageData as any).originatorId === designTokensLinkedDataId
                        ) {
                            const updatedDesignSystemDataDictionary: DataDictionary<unknown> =
                                this.designSystemDataDictionary &&
                                (this.designSystemDataDictionary[0][
                                    designTokensLinkedDataId
                                ].data as any)
                                    ? [
                                          {
                                              [designTokensLinkedDataId]: {
                                                  schemaId: this
                                                      .designSystemDataDictionary[0][
                                                      designTokensLinkedDataId
                                                  ].schemaId,
                                                  data: {
                                                      ...(messageData as any).data,
                                                  },
                                              },
                                          },
                                          designTokensLinkedDataId,
                                      ]
                                    : [
                                          {
                                              [designTokensLinkedDataId]: {
                                                  schemaId: "fastDesignTokens",
                                                  data: {
                                                      ...(messageData as any).data,
                                                  },
                                              },
                                          },
                                          designTokensLinkedDataId,
                                      ];

                            this.designSystemDataDictionary = updatedDesignSystemDataDictionary;
                            this.updateDOM(messageData as MessageSystemOutgoing);
                        } else if (
                            (messageData as any).data &&
                            (messageData as any).data.action ===
                                CustomMessageSystemActions.libraryAdd
                        ) {
                            // Import the web component library
                            await (elementLibraries[
                                (messageData as any).data.id
                            ] as WebComponentLibraryDefinition).import();
                            // Register elements from the web component library
                            (elementLibraries[
                                (messageData as any).data.id
                            ] as WebComponentLibraryDefinition).register();

                            window.postMessage(
                                {
                                    type: MessageSystemType.custom,
                                    action: ViewerCustomAction.call,
                                    options: {
                                        originatorId: previewOriginatorId,
                                    },
                                    data: {
                                        action: CustomMessageSystemActions.libraryAdded,
                                        id: (messageData as any).data.id,
                                    },
                                },
                                "*"
                            );
                        } else if (
                            (messageData as any).options &&
                            (messageData as any).options.originatorId ===
                                creatorOriginatorId
                        ) {
                            const action: string[] = ((messageData as any).options
                                .action as string).split("::");
                            if (action[0] === "displayMode") {
                                const mode: DisplayMode =
                                    action[1] === "preview"
                                        ? DisplayMode.preview
                                        : DisplayMode.interactive;
                                this.displayMode = mode;
                                this.htmlRenderMessageSystem.postMessage({
                                    type: MessageSystemType.custom,
                                    options: {
                                        originatorId: creatorOriginatorId,
                                        action:
                                            mode === DisplayMode.preview
                                                ? displayModeMessagePreview
                                                : displayModeMessageInteractive,
                                    },
                                });
                            }
                        }
                        break;
                }
            }
        }
    };

    private handleHtmlMessageSystem = (message: MessageEvent): void => {
        if (message.data) {
            if (
                message.data.type === MessageSystemType.navigation &&
                message.data.action === MessageSystemNavigationTypeAction.update &&
                message.data.options &&
                message.data.options.originatorId === htmlRenderOriginatorId
            ) {
                (this.activeDictionaryId = message.data.activeDictionaryId),
                    window.postMessage(
                        {
                            type: MessageSystemType.custom,
                            action: ViewerCustomAction.call,
                            value: message.data.activeDictionaryId,
                        },
                        "*"
                    );
            } else if (
                message.data.type === MessageSystemType.data &&
                message.data.action === MessageSystemNavigationTypeAction.update &&
                message.data.options &&
                message.data.options.originatorId === htmlRenderOriginatorId
            ) {
                window.postMessage(
                    {
                        type: MessageSystemType.custom,
                        action: ViewerCustomAction.call,
                        data: message.data.data,
                        dictionaryId: message.data.dictionaryId,
                    },
                    "*"
                );
            }
        }
    };
}
