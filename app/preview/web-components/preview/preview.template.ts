import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";
import { classNames, Direction } from "@microsoft/fast-web-utilities";
import { DisplayMode } from "../../../utilities";
import { Preview } from "./preview";

export const previewTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<Preview> = context => {
    return html<Preview>`
        <div
            className=${x =>
                classNames("preview", [
                    "previewMode",
                    x.displayMode === DisplayMode.preview,
                ])}
            dir=${x => x.direction}
        >
            <fast-tooling-html-render ${ref("renderRef")}>
                <fast-tooling-html-render-layer-navigation
                    role="htmlrenderlayer"
                    resizeobserverselector="#root .preview"
                ></fast-tooling-html-render-layer-navigation>
                <fast-tooling-html-render-layer-inline-edit
                    role="htmlrenderlayer"
                    autoselect
                ></fast-tooling-html-render-layer-inline-edit>
            </fast-tooling-html-render>
        </div>
    `;
};
