import {
    nativeElementDefinitions,
    nativeElementExtendedDefinitions,
} from "@microsoft/fast-tooling/dist/esm/definitions";
import { mapToJSONSchemas } from "../helpers";

const textSchema = {
    $schema: "http://json-schema.org/schema#",
    $id: "text",
    title: "Text",
    description: "A text strings schema definition.",
    type: "string",
    id: "text",
    formPluginId: "text",
};

const nativeElementSchemas: { [key: string]: any } = {};
const nativeElementExtendedSchemas: { [key: string]: any } = {};

mapToJSONSchemas(nativeElementDefinitions, nativeElementSchemas);
mapToJSONSchemas(nativeElementExtendedDefinitions, nativeElementExtendedSchemas);

/**
 * Map the formControlId to all property names for use by the <Form /> component
 */
Object.entries(nativeElementExtendedSchemas).forEach(([schemaKey]: [string, any]) => {
    Object.keys(nativeElementExtendedSchemas[schemaKey].properties).forEach(
        (propertyKey: string) => {
            nativeElementExtendedSchemas[schemaKey].properties[propertyKey][
                "formControlId"
            ] = propertyKey;
        }
    );
});

export {
    textSchema,
    nativeElementDefinitions,
    nativeElementSchemas,
    nativeElementExtendedSchemas,
};
