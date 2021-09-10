import React from "react";
import { Wrapper } from "../components";

// Prevent tree shaking
Wrapper;

export interface WrapperProps {
    activeElement: Element;
}

export interface WrapperState {
    mouseOver: boolean;
    x: number | null;
    y: number | null;
    width: number | null;
    height: number | null;
}

function updateWrapper(
    ref: React.RefObject<HTMLDivElement>,
    element: Element
): () => void {
    return (): void => {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        createWrapper(ref, element);
    };
}

function attachEventListeners(
    ref: React.RefObject<HTMLDivElement>,
    element: Element
): void {
    element.addEventListener("transitionstart", updateWrapper(ref, element));
    element.addEventListener("resize", updateWrapper(ref, element));
    element.addEventListener("transitionend", updateWrapper(ref, element));
}

function getWrapperAttributes(element: Element): any {
    const { x, y, width, height }: DOMRect = element.getBoundingClientRect() as DOMRect;

    return {
        x,
        y,
        width,
        height,
    };
}

function createSelectedElementIndicator(
    ref: React.RefObject<HTMLDivElement>,
    element: Element,
    attributes: any
): void {
    if (!ref || !ref.current) {
        return;
    }

    const wrapper = document.createElement("creator-wrapper");

    Object.entries(attributes).forEach(([key, value]: [string, number]) => {
        wrapper.setAttribute(key, value.toString());
    });

    if (ref.current.lastChild) {
        ref.current.replaceChild(wrapper, ref.current.lastChild);
    }
    attachEventListeners(ref, element);
}

export function createWrapper(
    ref: React.RefObject<HTMLDivElement>,
    element: Element
): void {
    createSelectedElementIndicator(ref, element, getWrapperAttributes(element));
}
