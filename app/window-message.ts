import { DataDictionary, MessageSystem, MessageSystemType, SchemaDictionary } from "@microsoft/fast-tooling";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";

export enum ExternalMessageType {
    initializeDataDictionary = "data-dictionary::initialize",
    addLibrary = "library::add",
    /**
     * @deprecated
     */
    dataDictionary = "data-dictionary",
}

export interface ExternalMessageInitializeDataDictionary {
    /**
     * The type of external message sent
     */
     type: ExternalMessageType.initializeDataDictionary;

     /**
      * The data dictionary for resetting the
      * current data dictionary
      */
     dataDictionary: DataDictionary<unknown>;
 
     /**
      * The schema dictionary for initializing the data
      */
     schemaDictionary: SchemaDictionary;
}

export interface ExternalMessageAddLibrary {
    /**
     * The type of external message sent
     */
     type: ExternalMessageType.addLibrary;

     /**
      * The component library to be added
      */
     libraryId: string;
}

/**
 * @deprecated
 */
export interface ExternalMessageInitializeDataDictionaryDeprecated {
    /**
     * The type of external message sent
     */
     type: ExternalMessageType.dataDictionary;

     /**
      * The data dictionary for resetting the
      * current data dictionary
      */
     data: DataDictionary<unknown>;
}

export type ExternalInitializingData = ExternalMessageInitializeDataDictionary | ExternalMessageAddLibrary | ExternalMessageInitializeDataDictionaryDeprecated;


export interface WindowMessageConfig {
    /**
     * The message system
     */
    messageSystem: MessageSystem;

    /**
     * @deprecated
     */
    schemaDictionary: SchemaDictionary;

    /**
     * The callback to add a library by ID
     */
    addLibraryCallback: (libraryId: string) => void;
}

export class WindowMessage<C extends WindowMessageConfig> {
    private messageSystem: MessageSystem;
    private schemaDictionary: SchemaDictionary;
    private addLibraryCallback: (libraryId: string) => void;

    constructor(config: C) {
        this.messageSystem = config.messageSystem;
        this.schemaDictionary = config.schemaDictionary;
        this.addLibraryCallback = config.addLibraryCallback;

        window.addEventListener("message", this.handleWindowMessage);
    }

    private handleWindowMessage = (e: MessageEvent): void => {
        if (e.data) {
            let messageData: XOR<null, ExternalInitializingData>;
    
            try {
                messageData = JSON.parse(e.data);
            } catch (e) {
                messageData = null;
            }
    
            if (messageData?.type) {
                switch (messageData.type) {
                    case ExternalMessageType.dataDictionary:
                        this.messageSystem.postMessage({
                            type: MessageSystemType.initialize,
                            data: messageData.data,
                            schemaDictionary: this.schemaDictionary,
                        });
                        break;
                    case ExternalMessageType.initializeDataDictionary:
                        this.messageSystem.postMessage({
                            type: MessageSystemType.initialize,
                            dataDictionary: messageData.dataDictionary,
                            schemaDictionary: (messageData as ExternalMessageInitializeDataDictionary).schemaDictionary,
                        });
                        break;
                    case ExternalMessageType.addLibrary:
                        this.addLibraryCallback(messageData.libraryId);
                        break;
                }
            }
        }
    };
}
