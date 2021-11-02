import { XOR } from "@microsoft/fast-tooling/dist/dts/data-utilities/type.utilities";

export interface LogoProps {
    /**
     * The class name to add
     */
    className?: string;

    /**
     * The version
     */
    version?: string;

    /**
     * The logo location
     */
    logo: string;

    /**
     * The title
     */
    title?: string;

    /**
     * Whether the what's new dialog is available
     */
    whatsNewAvailable: boolean;

    /**
     * The what's new overlay callback
     */
    handleWhatsNewOverlay: XOR<() => void, null>;
}
