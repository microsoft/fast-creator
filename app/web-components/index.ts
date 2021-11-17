import {
    fastBadge,
    fastButton,
    fastCheckbox,
    fastDialog,
    fastNumberField,
    fastOption,
    fastSelect,
    fastSlider,
    fastSliderLabel,
    fastSwitch,
    fastTab,
    fastTabPanel,
    fastTabs,
    fastTextField,
    fastTooltip,
} from "@microsoft/fast-components";
import {
    fastToolingColorPicker,
    fastToolingCSSBoxModel,
    fastToolingCSSLayout,
    fastToolingFile,
    fastToolingFileActionObjectUrl,
    fastToolingUnitsTextField,
} from "@microsoft/fast-tooling";
import { DesignSystem } from "@microsoft/fast-foundation";

export function registerWebComponents(): void {
    DesignSystem.getOrCreate().register(
        fastBadge(),
        fastButton(),
        fastCheckbox(),
        fastDialog(),
        fastNumberField(),
        fastOption(),
        fastSelect(),
        fastSlider(),
        fastSliderLabel(),
        fastSwitch(),
        fastTabs(),
        fastTab(),
        fastTabPanel(),
        fastTextField(),
        fastTooltip(),
        fastToolingColorPicker({ prefix: "fast-tooling" }),
        fastToolingCSSLayout({ prefix: "fast-tooling" }),
        fastToolingFile({ prefix: "fast-tooling" }),
        fastToolingFileActionObjectUrl({ prefix: "fast-tooling" }),
        fastToolingUnitsTextField({ prefix: "fast-tooling" }),
        fastToolingCSSBoxModel({ prefix: "fast-tooling" })
    );
}

export * from "./css-box-model";
export * from "./css-layout";
export * from "./dev-tools-toggle";
export * from "./dimension";
export * from "./editing-pane-region";
export * from "./logo";
export * from "./navigation-pane-region";
export * from "./preview-switch";
export * from "./project-file-transfer";
export * from "./select-device";
export * from "./whats-new";
