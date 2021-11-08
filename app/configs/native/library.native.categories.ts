import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import {
    articleTag,
    buttonTag,
    divTag,
    footerTag,
    headerTag,
    heading1Tag,
    heading2Tag,
    heading3Tag,
    heading4Tag,
    heading5Tag,
    heading6Tag,
    imageTag,
    inputTag,
    labelTag,
    mainTag,
    optionTag,
    paragraphTag,
    sectionTag,
    selectTag,
    spanTag,
    textAreaTag,
} from "./library.native.tags";

export const componentCategories: FormCategoryDictionary = {
    [divTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [imageTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style", "width", "height"],
            },
            {
                title: "Content",
                dataLocations: ["src"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "alt",
                    "srcset",
                    "crossorigin",
                    "usemap",
                    "ismap",
                    "decoding",
                    "importance",
                    "intrinsicsize",
                    "referrerpolicy",
                    "sizes",
                ],
                expandByDefault: false,
            },
        ],
    },
    [paragraphTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [spanTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading1Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading2Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading3Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading4Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading5Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [heading6Tag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [labelTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [buttonTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [mainTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [headerTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [footerTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [articleTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [sectionTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [textAreaTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
    [inputTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Options",
                dataLocations: ["type"],
            },
            {
                title: "State",
                dataLocations: ["checked", "disabled", "required", "value"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "accept",
                    "alt",
                    "autocomplete",
                    "autofocus",
                    "dirname",
                    "form",
                    "formaction",
                    "formenctype",
                    "formmethod",
                    "formnovalidate",
                    "formtarget",
                    "height",
                    "inputmode",
                    "list",
                    "max",
                    "maxlength",
                    "min",
                    "minlength",
                    "multiple",
                    "name",
                    "pattern",
                    "placeholder",
                    "readonly",
                    "size",
                    "src",
                    "step",
                    "width",
                ],
                expandByDefault: false,
            },
        ],
    },
    [selectTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "State",
                dataLocations: ["disabled", "required"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "autocomplete",
                    "autofocus",
                    "form",
                    "multiple",
                    "name",
                    "size",
                ],
                expandByDefault: false,
            },
        ],
    },
    [optionTag]: {
        "": [
            {
                title: "Style",
                dataLocations: ["style"],
            },
            {
                title: "Options",
                dataLocations: ["label"],
            },
            {
                title: "State",
                dataLocations: ["disabled", "selected", "value"],
            },
            {
                title: "Content",
                dataLocations: ["Slot"],
            },
        ],
    },
};
