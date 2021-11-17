/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */
import React from "react";
import { Select } from "@microsoft/fast-foundation";
import h from "../pragma";
import { defaultDevices, Device } from "../../devices";

function renderDeviceOptions(): React.ReactNode {
    return defaultDevices.map((deviceOption: Device) => {
        return (
            <fast-option
                key={deviceOption.id}
                value={deviceOption.id}
                style={{ height: "auto" }}
            >
                {deviceOption.displayName}
            </fast-option>
        );
    });
}

export function renderDeviceSelect(
    selectedDeviceId: string,
    onChangeCallback: (deviceId: string) => void,
    disable: boolean
): React.ReactNode {
    return (
        <fast-select
            value={selectedDeviceId}
            events={{
                change: (e: React.ChangeEvent): void => {
                    onChangeCallback((e.target as Select).value);
                },
            }}
            disabled={disable ? true : null}
            style={{ minWidth: "170px" }}
        >
            {renderDeviceOptions()}
        </fast-select>
    );
}
