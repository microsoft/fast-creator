import { extendElementDefinitions } from "@microsoft/fast-tooling/dist/esm/definitions";
import * as fastComponentDefinitions from "@microsoft/fast-components/dist/esm/component-definitions";
import { mapToJSONSchemas } from "../helpers";

export const fastLibraryName = "FAST";
const fastComponentExtendedDefinitions = extendElementDefinitions(
    fastComponentDefinitions
);

const fastComponentSchemas: { [key: string]: any } = {};
const fastComponentExtendedSchemas: { [key: string]: any } = {};

mapToJSONSchemas(fastComponentDefinitions, fastComponentSchemas, fastLibraryName);

mapToJSONSchemas(
    fastComponentExtendedDefinitions,
    fastComponentExtendedSchemas,
    fastLibraryName
);

/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(fastComponentExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(fastComponentExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            fastComponentExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});

export { fastComponentDefinitions, fastComponentSchemas, fastComponentExtendedSchemas };
