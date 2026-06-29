import { MEDIA_QUERY } from "../../utils/breakpoint";
import { stateProps, stateStore } from "../../utils/state";
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
        "shrink-0 bg-neutral-900 flex justify-between items-center pt-8 mb-8 lg:mb-16";

    const headingElement: HTMLDivElement = document.createElement("div");
    headingElement.className = "flex gap-2 items-center justify-end";

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "flex gap-1";

    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "text-neutral-500";

    function render(state: stateProps) {
        const logo: string = state.isDesktop
            ? logoIcon.desktop
            : logoIcon.mobile;
        const label: string = state.isDesktop ? "Personal Best: " : "Best: ";

        spanElement.textContent = label;

        paragraphElement.innerHTML = "";
        paragraphElement.append(spanElement, `${state.personalBest} WPM`);

        headingElement.innerHTML = "";
        headingElement.insertAdjacentHTML("beforeend", ICON_PERSONAL_BEST);
        headingElement.append(paragraphElement);

        headerElement.innerHTML = "";
        headerElement.insertAdjacentHTML("beforeend", logo);
        headerElement.append(headingElement);
    }

    stateStore.subscribe(render);

    MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) => {
        stateStore.setState({ isDesktop: e.matches });
    });

    render(stateStore.getState());

    return headerElement;
}
