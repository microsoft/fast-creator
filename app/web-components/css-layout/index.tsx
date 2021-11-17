/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import h from "../pragma";

export interface CSSLayoutProps {
    onChange: (config: { [key: string]: string }) => void;
    webComponentKey: string;
    value: { [key: string]: string };
}

export default class CSSLayout extends React.Component<CSSLayoutProps, {}> {
    public layoutRef: React.RefObject<any>;

    private setLayoutRef = el => {
        this.layoutRef = el;

        if (this.layoutRef) {
            (this.layoutRef as any).onChange = e => {
                this.props.onChange(e);
            };
        }
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
            <fast-tooling-css-layout
                value={newValue}
                key={this.props.webComponentKey}
                ref={this.setLayoutRef}
            ></fast-tooling-css-layout>
        );
    }
}
