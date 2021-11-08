import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import {
    fluentAnchorTag,
    fluentButtonTag,
    fluentCheckboxTag,
    fluentDialogTag,
    fluentFlipperTag,
    fluentRadioGroupTag,
    fluentRadioTag,
    fluentSliderTag,
    fluentSwitchTag,
    fluentTabsTag,
    fluentTextAreaTag,
    fluentTextFieldTag,
} from "./library.fluent-ui.tags";

export const componentCategories: FormCategoryDictionary = {
    [fluentAnchorTag]: {
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
    [fluentButtonTag]: {
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
    [fluentCheckboxTag]: {
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
    [fluentDialogTag]: {
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
    [fluentFlipperTag]: {
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
    [fluentRadioTag]: {
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
    [fluentRadioGroupTag]: {
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
    [fluentSliderTag]: {
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
    [fluentSwitchTag]: {
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
    [fluentTabsTag]: {
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
    [fluentTextAreaTag]: {
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
    [fluentTextFieldTag]: {
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
