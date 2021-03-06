import { DesignSystem } from "@microsoft/fast-foundation";
import {
    fastToolingHTMLRender,
    fastToolingHTMLRenderLayerInlineEdit,
    fastToolingHTMLRenderLayerNavigation,
    MessageSystem,
    Shortcuts,
    ShortcutsActionDelete,
    ShortcutsActionDuplicate,
    ShortcutsActionRedo,
    ShortcutsActionUndo,
} from "@microsoft/fast-tooling";
import FASTMessageSystemWorker from "@microsoft/fast-tooling/dist/message-system.min.js";
import { fastToolingPreview } from "./web-components/preview/";
import { Preview } from "./web-components/preview/preview";

/**
 * Get the root div element
 */
const root = document.getElementById("root");

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

/**
 * Setup the FAST tooling web worker
 */
const htmlRenderMessageSystemWorker: Worker = new FASTMessageSystemWorker();
const fastMessageSystem = new MessageSystem({
    webWorker: htmlRenderMessageSystemWorker,
});

/**
 * Setup the Preview
 */
const previewWebComponent = document.querySelector("fast-tooling-preview") as Preview;
previewWebComponent.messageSystem = fastMessageSystem;

/**
 * Setup the Shortcuts
 */
new Shortcuts({
    messageSystem: fastMessageSystem,
    target: root as HTMLElement,
    actions: [
        ShortcutsActionDelete(fastMessageSystem),
        ShortcutsActionDuplicate(fastMessageSystem),
        ShortcutsActionRedo(fastMessageSystem),
        ShortcutsActionUndo(fastMessageSystem),
    ],
});
