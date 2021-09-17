import Preview from "./preview";

import { DesignSystem } from "@microsoft/fast-foundation";
import { fastToolingPreview } from "./web-components/preview/";
import {
    fastToolingHTMLRender,
    fastToolingHTMLRenderLayerInlineEdit,
    fastToolingHTMLRenderLayerNavigation,
} from "@microsoft/fast-tooling";
/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
DesignSystem.getOrCreate().register(
    fastToolingPreview({ prefix: "fast-tooling" }),
    fastToolingHTMLRender({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerNavigation({ prefix: "fast-tooling" }),
    fastToolingHTMLRenderLayerInlineEdit({ prefix: "fast-tooling" })
);

/**
 * Create the a style override
 */
const style: HTMLStyleElement = document.createElement("style");
style.innerText =
    "@font-face { font-family: SegoeUIVF; src: url(https://static.fast.design/assets/fonts/SegoeUI-Roman-VF_web.ttf) format(\"truetype\"); font-weight: \"1 1000\"; } @font-face { font-family: 'Segoe UI'; src: url('//c.s-microsoft.com/static/fonts/segoe-ui/west-european/Normal/latest.woff2') format('woff2'); } body, html { font-family: SegoeUIVF, Segoe UI, SegoeUI, Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; padding: 0; margin: 0; }";
document.head.appendChild(style);
