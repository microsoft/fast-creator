/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import { cssBoxModelCssProperties } from "@microsoft/fast-tooling";
import h from "../pragma";

export interface CSSBoxModelProps {
    onChange: (config: { [key: string]: string }) => void;
    webComponentKey: string;
    value: { [key: string]: string };
}

export default class CSSBoxModel extends React.Component<CSSBoxModelProps, {}> {
    private handleChange = (newStyle: string) => {
        const styles: Array<string> = newStyle.split(";");
        const output = {};
        cssBoxModelCssProperties.forEach(prop => {
            output[prop] = "";
        });
        styles.forEach(value => {
            const style: Array<string> = value.split(":");
            if (style[0] !== "") {
                output[style[0]] = style[1];
            }
        });
        this.props.onChange(output);
    };

    render() {
        const newValue: string = Object.entries(this.props.value)
            .map(([key, value]: [string, string]) => {
                return `${key}: ${value};`;
            })
            .reduce((prevValue, currValue) => {
                return `${prevValue} ${currValue}`;
            }, "");
        return (
            <fast-tooling-css-box-model
                value={newValue}
                key={this.props.webComponentKey}
                events={{
                    change: (e: React.ChangeEvent): void => {
                        this.handleChange((e.target as HTMLInputElement).value);
                    },
                }}
            ></fast-tooling-css-box-model>
        );
    }
}
