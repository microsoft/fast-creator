// custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
        "fast-badge": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            fill?: string;
            color?: string;
        };
        "fast-button": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            disabled?: boolean;
            appearance?: string;
            events?: {
                click?: (e: React.MouseEvent<HTMLElement>) => void;
            };
        };
        "fast-number-field": React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLElement>,
            HTMLElement
        > & {
            value?: number;
            size?: number;
            disabled?: string;
            events?: {
                input?: (e: React.ChangeEvent<HTMLInputElement>) => void;
            };
            "hide-step"?: boolean;
        };
    }
}

/**
 * Satisfy TypeScript importing modules without typings
 */
declare module "@skatejs/val";
