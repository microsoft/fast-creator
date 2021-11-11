/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React, { useEffect, useState } from "react";
import { fastBadge } from "@microsoft/fast-components";
import h from "../pragma";
import { LogoProps } from "./logo.props";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
fastBadge;

const backgroundStyle = {
    display: "flex",
    height: "32px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px",
};
const headerStyle = {
    fontSize: "var(--type-ramp-base-font-size)",
    fontWeight: 600,
    lineHeight: "var(--type-ramp-base-line-height)",
    color: "#FFFFFF",
};
const imageStyle = { verticalAlign: "middle", height: "32px" };
const spanStyle = { verticalAlign: "middle", margin: "0 10px" };

export const Logo: React.FC<LogoProps> = ({
    className,
    logo,
    title,
    version,
    whatsNewAvailable,
    handleWhatsNewOverlay,
}: React.PropsWithChildren<LogoProps>): React.ReactElement => {
    const versionIndicator = whatsNewAvailable ? (
        <fast-button
            onClick={handleWhatsNewOverlay !== null ? handleWhatsNewOverlay : undefined}
            appearance={"accent"}
        >
            {version}
        </fast-button>
    ) : (
        <fast-badge color={"primary"} fill={"primary"}>
            {version}
        </fast-badge>
    );

    return (
        <div className={className} style={backgroundStyle}>
            <h1 style={headerStyle}>
                <img src={logo} style={imageStyle} />
                <span style={spanStyle}>{title}</span>
            </h1>
            {versionIndicator}
        </div>
    );
};

export * from "./logo.props";
