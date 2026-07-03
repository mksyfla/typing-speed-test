import { displayStateProps, displayStateStore } from "../../utils/breakpoint";
import { store } from "../../utils/state";
import {
    ICON_LOGO_DESKTOP,
    ICON_LOGO_MOBILE,
    ICON_PERSONAL_BEST,
    SVG_ICON_DATA_TYPES,
} from "../../utils/svg";

export function header(): HTMLElement {
    const logoIcon: {
        mobile: SVG_ICON_DATA_TYPES;
        desktop: SVG_ICON_DATA_TYPES;
    } = {
        mobile: ICON_LOGO_MOBILE,
        desktop: ICON_LOGO_DESKTOP,
    };

    const headerElement: HTMLElement = document.createElement("header");
    headerElement.className =
        "mb-4 flex shrink-0 items-center justify-between bg-neutral-900 pt-4 lg:mb-8 lg:pt-6";

    const headingElement: HTMLDivElement = document.createElement("div");
    headingElement.className = "flex items-center justify-end gap-2";

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "flex gap-1 text-sm lg:text-base";

    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "text-neutral-500";
    const logoContainer = document.createElement("div");

    paragraphElement.append(spanElement, "0 WPM");
    headingElement.insertAdjacentHTML("beforeend", ICON_PERSONAL_BEST);
    headingElement.append(paragraphElement);
    headerElement.append(logoContainer, headingElement);

    function renderDisplaySize(state: displayStateProps) {
        logoContainer.innerHTML = state.isDesktop ? logoIcon.desktop : logoIcon.mobile;
        spanElement.textContent = state.isDesktop ? "Personal Best:" : "Best:";
    }

    function renderPersonalBest(state: pbStateProps) {
        if (paragraphElement.lastChild)
            paragraphElement.lastChild.textContent = `${state.personalBest} WPM`;
    }

    displayStateStore.subscribe(renderDisplaySize);
    pbStateStore.subscribe(renderPersonalBest);

    renderDisplaySize(displayStateStore.getState());
    renderPersonalBest(pbStateStore.getState());

    return headerElement;
}

export interface pbStateProps {
    personalBest: number;
}

const pbState: pbStateProps = {
    personalBest: parseInt(localStorage.getItem("personal-best") ?? "0"),
};

export const pbStateStore = store<pbStateProps>(pbState);
