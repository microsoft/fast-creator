import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import {
    fastAccordionItemTag,
    fastAnchoredRegionTag,
    fastAnchorTag,
    fastButtonTag,
    fastCheckboxTag,
    fastDialogTag,
    fastFlipperTag,
    fastListboxTag,
    fastNumberFieldTag,
    fastRadioGroupTag,
    fastRadioTag,
    fastSelectTag,
    fastSliderTag,
    fastSwitchTag,
    fastTabsTag,
    fastTextAreaTag,
    fastTextFieldTag,
} from "./library.fast.tags";

export const designTokenCategories: FormCategoryDictionary = {
    fastDesignTokens: {
        "": [
            {
                title: "Color",
                dataLocations: [
                    "base-layer-luminance",
                    "fill-color",
                    "accent-base-color",
                ],
            },
            {
                title: "Style",
                dataLocations: [
                    "control-corner-radius",
                    "stroke-width",
                    "focus-stroke-width",
                    "disabled-opacity",
                ],
            },
            {
                title: "Advanced",
                expandByDefault: false,
                dataLocations: [
                    "theme",
                    "design-unit",
                    "direction",
                    "type-ramp-minus-2-font-size",
                    "type-ramp-minus-2-line-height",
                    "type-ramp-minus-1-font-size",
                    "type-ramp-minus-1-line-height",
                    "type-ramp-base-font-size",
                    "type-ramp-base-line-height",
                    "type-ramp-plus-1-font-size",
                    "type-ramp-plus-1-line-height",
                    "type-ramp-plus-2-font-size",
                    "type-ramp-plus-2-line-height",
                    "type-ramp-plus-3-font-size",
                    "type-ramp-plus-3-line-height",
                    "type-ramp-plus-4-font-size",
                    "type-ramp-plus-4-line-height",
                    "type-ramp-plus-5-font-size",
                    "type-ramp-plus-5-line-height",
                    "type-ramp-plus-6-font-size",
                    "type-ramp-plus-6-line-height",
                    "accent-fill-rest-delta",
                    "accent-fill-hover-delta",
                    "accent-fill-active-delta",
                    "accent-fill-focus-delta",
                    "accent-fill-selected-delta",
                    "accent-foreground-rest-delta",
                    "accent-foreground-hover-delta",
                    "accent-foreground-active-delta",
                    "accent-foreground-focus-delta",
                    "neutral-fill-rest-delta",
                    "neutral-fill-hover-delta",
                    "neutral-fill-active-delta",
                    "neutral-fill-focus-delta",
                    "neutral-fill-selected-delta",
                    "neutral-fill-input-rest-delta",
                    "neutral-fill-input-hover-delta",
                    "neutral-fill-input-active-delta",
                    "neutral-fill-input-focus-delta",
                    "neutral-fill-input-selected-delta",
                    "neutral-fill-stealth-rest-delta",
                    "neutral-fill-stealth-hover-delta",
                    "neutral-fill-stealth-active-delta",
                    "neutral-fill-stealth-focus-delta",
                    "neutral-fill-stealth-selected-delta",
                    "neutral-fill-toggle-hover-delta",
                    "neutral-fill-toggle-active-delta",
                    "neutral-fill-toggle-focus-delta",
                    "neutral-fill-card-delta",
                    "neutral-foreground-hover-delta",
                    "neutral-foreground-active-delta",
                    "neutral-foreground-focus-delta",
                    "neutral-divider-rest-delta",
                    "neutral-outline-rest-delta",
                    "neutral-outline-hover-delta",
                    "neutral-outline-active-delta",
                    "neutral-outline-focus-delta",
                    "neutral-contrast-fill-rest-delta",
                    "neutral-contrast-fill-hover-delta",
                    "neutral-contrast-fill-active-delta",
                    "neutral-contrast-fill-focus-delta",
                    "Slot",
                ],
            },
        ],
    },
};

export const componentCategories: FormCategoryDictionary = {
    [fastAccordionItemTag]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["heading-level", "id"],
                expandByDefault: false,
            },
        ],
    },
    [fastAnchorTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["disabled"],
            },
            {
                title: "Options",
                dataLocations: ["appearance", "type"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotStart", "SlotEnd"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "name",
                    "form",
                    "formaction",
                    "formenctype",
                    "formmethod",
                    "formnovalidate",
                    "formtarget",
                    "value",
                ],
                expandByDefault: false,
            },
        ],
    },
    [fastAnchoredRegionTag]: {
        "": [
            {
                title: "Advanced",
                dataLocations: [
                    "viewport",
                    "horizontal-threshold",
                    "horizontal-scaling",
                    "vertical-threshold",
                    "vertical-scaling",
                    "fixed-placement",
                ],
                expandByDefault: false,
            },
        ],
    },
    [fastButtonTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["disabled"],
            },
            {
                title: "Options",
                dataLocations: ["appearance", "type"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotStart", "SlotEnd"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "name",
                    "form",
                    "formaction",
                    "formenctype",
                    "formmethod",
                    "formnovalidate",
                    "formtarget",
                    "value",
                ],
                expandByDefault: false,
            },
        ],
    },
    [fastCheckboxTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["checked", "required", "disabled", "readonly"],
            },
            {
                title: "Content",
                dataLocations: [
                    "Slot",
                    "SlotIndeterminateIndicator",
                    "SlotCheckedIndicator",
                ],
            },
            {
                title: "Advanced",
                dataLocations: ["name"],
                expandByDefault: false,
            },
        ],
    },
    [fastDialogTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Options",
                dataLocations: ["modal"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "aria-label",
                    "aria-describedby",
                    "aria-labelledby",
                    "hidden",
                    "trap-focus",
                ],
                expandByDefault: false,
            },
        ],
    },
    [fastFlipperTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["disabled"],
            },
            {
                title: "Options",
                dataLocations: ["direction"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotPrevious", "SlotNext"],
            },
            {
                title: "Advanced",
                dataLocations: ["aria-hidden"],
                expandByDefault: false,
            },
        ],
    },
    [fastListboxTag]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["role"],
                expandByDefault: false,
            },
        ],
    },
    [fastNumberFieldTag]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["autofocus", "value", "list"],
                expandByDefault: false,
            },
        ],
    },
    [fastRadioTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["checked", "required", "disabled", "readonly"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotCheckedIndicator"],
            },
            {
                title: "Advanced",
                dataLocations: ["name"],
                expandByDefault: false,
            },
        ],
    },
    [fastRadioGroupTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["disabled", "readonly"],
            },
            {
                title: "Options",
                dataLocations: ["orientation"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotLabel"],
            },
            {
                title: "Advanced",
                dataLocations: ["name", "value"],
                expandByDefault: false,
            },
        ],
    },
    [fastSelectTag]: {
        "": [
            {
                title: "Advanced",
                dataLocations: ["name"],
            },
        ],
    },
    [fastSliderTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["required", "disabled", "readonly"],
            },
            {
                title: "Options",
                dataLocations: ["max", "min", "step", "value", "orientation"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotTrack", "SlotThumb"],
            },
            {
                title: "Advanced",
                dataLocations: ["name", "value"],
                expandByDefault: false,
            },
        ],
    },
    [fastSwitchTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["checked", "required", "disabled", "readonly"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotCheckedMessage", "SlotUncheckedMessage"],
            },
            {
                title: "Advanced",
                dataLocations: ["name"],
                expandByDefault: false,
            },
        ],
    },
    [fastTabsTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Options",
                dataLocations: ["orientation"],
            },
            {
                title: "Content",
                dataLocations: ["SlotTab", "SlotTabpanel", "SlotStart", "SlotEnd"],
            },
            {
                title: "Advanced",
                dataLocations: ["activeid"],
                expandByDefault: false,
            },
        ],
    },
    [fastTextAreaTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["required", "disabled", "readonly"],
            },
            {
                title: "Options",
                dataLocations: ["appearance", "placeholder"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "form",
                    "list",
                    "spellcheck",
                    "name",
                    "value",
                    "resize",
                    "cols",
                    "rows",
                    "maxlength",
                    "minlength",
                ],
                expandByDefault: false,
            },
        ],
    },
    [fastTextFieldTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["required", "disabled", "readonly"],
            },
            {
                title: "Options",
                dataLocations: ["type", "appearance", "placeholder"],
            },
            {
                title: "Content",
                dataLocations: ["Slot", "SlotStart", "SlotEnd"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "value",
                    "autofocus",
                    "list",
                    "pattern",
                    "spellcheck",
                    "name",
                    "maxlength",
                    "minlength",
                    "size",
                ],
                expandByDefault: false,
            },
        ],
    },
};
