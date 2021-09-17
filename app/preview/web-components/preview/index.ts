import { Preview } from "./preview";
import { previewTemplate as template } from "./preview.template";

/**
 * A web component for rendering HTML using the MessageSystem.
 *
 * @alpha
 * @remarks
 * HTML Element: \<html-render\>
 */
export const fastToolingPreview = Preview.compose({
    baseName: "preview",
    template,
});
