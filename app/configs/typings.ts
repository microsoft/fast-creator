import { Data } from "@microsoft/fast-tooling";
import { VSCodeNativeHTMLDefinition } from "@microsoft/fast-tooling/dist/esm/definitions/native/html-native.vs-code-v1.1-types";

export interface WebComponentDefinition {
    /**
     * The display name for the component
     */
    displayName: string;

    /**
     * The JSON schema for the component
     */
    schema: { [key: string]: unknown };

    /**
     * An example to use when a component is newly added
     */
    example: Data<unknown>;
}

export interface NativeElementLibraryDefinition {
    /**
     * This makes the library optional which will affect the UI.
     */
    optional: boolean;

    /**
     * The unique ID for the component library
     */
    id: string;

    /**
     * The dictionary of components in this component library
     */
    componentDictionary: { [key: string]: WebComponentDefinition };

    /**
     * The components definitions for the 1.1 version of the vscode custom data format
     */
    customData: VSCodeNativeHTMLDefinition;

    /**
     * The display name for the component library
     */
    displayName: string;
}

export interface WebComponentLibraryDefinition extends NativeElementLibraryDefinition {
    /**
     * The script location
     */
    import: () => void;

    /**
     * Register web components within this function
     */
    register: () => void;
}

export type ElementLibraryDefinition =
    | NativeElementLibraryDefinition
    | WebComponentLibraryDefinition;
