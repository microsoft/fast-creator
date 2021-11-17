/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";

import CSSControl from "@microsoft/fast-tooling-react/dist/form/custom-controls/control.css";
import { CSSPropertiesDictionary } from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { CSSStandardControlPlugin } from "@microsoft/fast-tooling-react/dist/form/custom-controls/css";
import { CSSControlConfig } from "@microsoft/fast-tooling-react/dist/form/custom-controls/css/css.template.control.standard.props";
import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import {
    ControlConfig,
    FileControl,
    ModularForm,
    StandardControlPlugin,
} from "@microsoft/fast-tooling-react";
import { ControlContext } from "@microsoft/fast-tooling-react/dist/form/templates/types";
import {
    cssBoxModelCssProperties,
    cssLayoutCssProperties,
    MessageSystem,
} from "@microsoft/fast-tooling";
import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";
import { FormId } from "../../creator.props";
import { properties as CSSProperties } from "../../css-data";
import { componentCategories as nativeComponentCategories } from "../../configs/native/library.native.categories";
import { componentCategories as fluentUIComponentCategories } from "../../configs/fluent-ui/library.fluent-ui.categories";
import { componentCategories as fastComponentCategories } from "../../configs/fast/library.fast.categories";
import CSSLayout from "../css-layout";
import CSSBoxModel from "../css-box-model";
import h from "../pragma";

const componentCategories: FormCategoryDictionary = {
    ...nativeComponentCategories,
    ...fluentUIComponentCategories,
    ...fastComponentCategories,
};

function getColorPickerControl(
    id: string,
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin {
    return new StandardControlPlugin({
        id,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            return (
                <fast-tooling-color-picker
                    value={config.value || config.default}
                    events={{
                        change: (e: React.ChangeEvent<HTMLInputElement>): void => {
                            updateHandler({
                                [config.dataLocation]: e.target.value,
                            });
                        },
                    }}
                ></fast-tooling-color-picker>
            );
        },
    });
}

export function getColorPickerControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[] {
    return [
        getColorPickerControl("fill-color", updateHandler),
        getColorPickerControl("accent-base-color", updateHandler),
    ];
}

function getSliderLabels(positions: number[]): React.ReactNode {
    const positionLength = positions.length - 1;

    return positions.map((position: number, index: number) => {
        const displayNumber: XOR<void, number> =
            positions.length > 10 && index !== 0 && index !== positionLength
                ? undefined
                : position;
        return (
            <fast-slider-label key={position} position={position}>
                {displayNumber}
            </fast-slider-label>
        );
    });
}

function getSliderControl(
    id: string,
    updateHandler: (updatedData: { [key: string]: unknown }) => void,
    min: number,
    max: number,
    step: number = 1,
    defaultValue?: number
): StandardControlPlugin {
    return new StandardControlPlugin({
        id,
        context: ControlContext.fill,
        control: (config: ControlConfig): React.ReactNode => {
            const positions: number[] = new Array((max - min) / step + 1)
                .fill(0)
                .map((number: number, index: number): number => {
                    return min + step * index;
                });

            return (
                <fast-slider
                    value={config.value || defaultValue}
                    min={min}
                    max={max}
                    step={step}
                    events={{
                        change: (e: React.ChangeEvent<HTMLInputElement>): void => {
                            updateHandler({
                                [config.dataLocation]: parseFloat(e.target.value),
                            });
                        },
                    }}
                >
                    {getSliderLabels(positions)}
                </fast-slider>
            );
        },
    });
}

export function getSliderControls(
    updateHandler: (updatedData: { [key: string]: unknown }) => void
): StandardControlPlugin[] {
    return [
        getSliderControl("base-layer-luminance", updateHandler, 0, 1, 0.1, 1),
        getSliderControl("control-corner-radius", updateHandler, 0, 22, 1, 3),
        getSliderControl("stroke-width", updateHandler, 0, 12, 1, 1),
        getSliderControl("focus-stroke-width", updateHandler, 0, 12, 1, 2),
        getSliderControl("disabled-opacity", updateHandler, 0, 1, 0.1, 0.3),
    ];
}

function getImageUploadControl(): StandardControlPlugin {
    return new StandardControlPlugin({
        id: "src",
        context: ControlContext.fill,
        control: (controlConfig: ControlConfig): React.ReactNode => {
            return (
                <FileControl
                    {...controlConfig}
                    accept=".apng,.avif,.gif,.jpg,.jpeg,.png,.webp"
                >
                    Add Image
                </FileControl>
            );
        },
    });
}

function getCSSControls(): StandardControlPlugin {
    return new StandardControlPlugin({
        id: "style",
        context: ControlContext.fill,
        control: (controlConfig: ControlConfig): React.ReactNode => {
            return (
                <CSSControl
                    key={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                    css={(CSSProperties as unknown) as CSSPropertiesDictionary}
                    cssControls={[
                        new CSSStandardControlPlugin({
                            id: "layout",
                            propertyNames: cssLayoutCssProperties,
                            control: (config: CSSControlConfig) => {
                                return (
                                    <CSSLayout
                                        key={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        webComponentKey={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        value={config.css}
                                        onChange={config.onChange}
                                    />
                                );
                            },
                        }),
                        new CSSStandardControlPlugin({
                            id: "boxmodel",
                            propertyNames: cssBoxModelCssProperties,
                            control: (config: CSSControlConfig) => {
                                return (
                                    <CSSBoxModel
                                        key={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        webComponentKey={`${controlConfig.dictionaryId}::${controlConfig.dataLocation}`}
                                        value={config.css}
                                        onChange={config.onChange}
                                    />
                                );
                            },
                        }),
                    ]}
                    {...controlConfig}
                />
            );
        },
    });
}

export function renderFormTabs(
    activeId: any,
    fastMessageSystem: MessageSystem,
    fastDesignMessageSystem: MessageSystem,
    linkedDataControl: StandardControlPlugin,
    handleFormVisibility: (formId: any) => void,
    handleDesignSystemChange: (updatedData: { [key: string]: unknown }) => void
): React.ReactNode {
    const formStyleOverride: string = `
        fast-tab-panel > div { width: 100%; }
    `;

    return (
        <fast-tabs
            activeId={activeId}
            events={{
                change: (e: React.ChangeEvent<HTMLElement>) => {
                    if ((e as any).detail) {
                        handleFormVisibility((e as any).detail.id);
                    }
                },
            }}
        >
            <fast-tab id={FormId.component}>Components</fast-tab>
            <fast-tab id={FormId.designSystem}>Design Tokens</fast-tab>
            <fast-tab-panel id={FormId.component + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.component}
                    messageSystem={fastMessageSystem}
                    controls={[
                        linkedDataControl,
                        getCSSControls(),
                        getImageUploadControl(),
                    ]}
                    categories={componentCategories}
                />
            </fast-tab-panel>
            <fast-tab-panel id={FormId.designSystem + "Panel"}>
                <style>{formStyleOverride}</style>
                <ModularForm
                    key={FormId.designSystem}
                    messageSystem={fastDesignMessageSystem}
                    controls={[
                        linkedDataControl,
                        ...getSliderControls(handleDesignSystemChange),
                        ...getColorPickerControls(handleDesignSystemChange),
                        getCSSControls(),
                    ]}
                    categories={componentCategories}
                />
            </fast-tab-panel>
        </fast-tabs>
    );
}
