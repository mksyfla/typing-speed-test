import { stateStore } from "./state";

export const BREAKPOINTS: {
    xl: number;
    lg: number;
    md: number;
    sm: number;
} = {
    xl: 1280,
    lg: 1024,
    md: 768,
    sm: 640,
};

export const MEDIA_QUERY: MediaQueryList = window.matchMedia(
    `(min-width: ${BREAKPOINTS.lg}px)`,
);

MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) => {
    stateStore.setState({ isDesktop: e.matches }, "Change Media Query");
});
