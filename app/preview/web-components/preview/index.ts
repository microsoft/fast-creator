import { Preview } from "./preview";
import { previewTemplate as template } from "./preview.template";
//import { previewStyles as styles } from "./preview.styles";

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
    //    styles,
});
