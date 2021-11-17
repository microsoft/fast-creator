/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import h from "../pragma";
import { toggleStyle } from "../../components/style";

export function renderPreviewSwitch(
    switchState: boolean,
    onChangeCallback: (newState: boolean) => void,
    disable: boolean
): React.ReactNode {
    return (
        <fast-switch
            checked={switchState ? true : null}
            disabled={disable ? true : null}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback(!switchState);
                },
            }}
            style={toggleStyle}
        >
            <span>Preview</span>
        </fast-switch>
    );
}
