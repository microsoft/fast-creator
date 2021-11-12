import { mapWebComponentDefinitionToJSONSchema } from "@microsoft/fast-tooling";
import { WebComponentDefinition } from "@microsoft/fast-tooling/dist/esm/data-utilities/web-component";

const headingAlias: string = "Heading level";
const alias: { [key: string]: string } = {
    h1: `${headingAlias} 1`,
    h2: `${headingAlias} 2`,
    h3: `${headingAlias} 3`,
    h4: `${headingAlias} 4`,
    h5: `${headingAlias} 5`,
    h6: `${headingAlias} 6`,
    p: "Paragraph",
    hr: "Thematic Break (Horizontal Rule)",
    ol: "Ordered list",
    ul: "Unordered list",
    li: "List item",
    div: "Container",
    a: "Hyperlink",
    img: "Image",
};

export function mapToJSONSchemas(
    definitions: { [key: string]: WebComponentDefinition },
    schemas: { [key: string]: any },
    libraryName?: string
): void {
    Object.entries(definitions).forEach(
        ([, definition]: [string, WebComponentDefinition]) => {
            mapWebComponentDefinitionToJSONSchema(definition).forEach(
                (definitionTagItem: any) => {
                    const jsonSchema = definitionTagItem;
                    schemas[jsonSchema.$id] = {
                        ...jsonSchema,
                        ...(alias[jsonSchema.$id]
                            ? {
                                  alias: alias[jsonSchema.$id],
                              }
                            : {}),
                    };

                    if (libraryName) {
                        schemas[jsonSchema.$id].title = `${
                            schemas[jsonSchema.$id].title
                        } (${libraryName})`;
                    }
                }
            );
        }
    );
}
