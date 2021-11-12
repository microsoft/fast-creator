import { extendElementDefinitions } from "@microsoft/fast-tooling/dist/esm/definitions";
import * as fluentUIComponentDefinitions from "@fluentui/web-components/dist/esm/component-definitions";
import { mapToJSONSchemas } from "../helpers";

export const fluentUILibraryName = "Fluent UI";
const fluentUIComponentExtendedDefinitions = extendElementDefinitions(
    fluentUIComponentDefinitions
);

const fluentUIComponentSchemas: { [key: string]: any } = {};
const fluentUIComponentExtendedSchemas: { [key: string]: any } = {};

mapToJSONSchemas(
    fluentUIComponentDefinitions,
    fluentUIComponentSchemas,
    fluentUILibraryName
);

mapToJSONSchemas(
    fluentUIComponentExtendedDefinitions,
    fluentUIComponentExtendedSchemas,
    fluentUILibraryName
);

/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(fluentUIComponentExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(fluentUIComponentExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            fluentUIComponentExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});

export {
    fluentUIComponentDefinitions,
    fluentUIComponentSchemas,
    fluentUIComponentExtendedSchemas,
};
