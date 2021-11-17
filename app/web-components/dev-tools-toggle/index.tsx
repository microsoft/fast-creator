/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import h from "../pragma";
import { downChevron, upChevron } from "../../icons";

export function renderDevToolToggle(
    selected: boolean,
    onToggleCallback: () => void,
    className: string
) {
    return (
        <fast-button
            events={{
                click: (e: React.MouseEvent) => {
                    onToggleCallback();
                },
            }}
            className={className}
        >
            {selected ? downChevron() : upChevron()}
        </fast-button>
    );
}
