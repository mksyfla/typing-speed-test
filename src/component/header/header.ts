import { MEDIA_QUERY } from "../../utils/breakpoint";
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
        "flex justify-between items-center pt-8 mb-8 lg:mb-16";

    const headingElement: HTMLDivElement = document.createElement("div");
    headingElement.className = "flex gap-2 items-center justify-end";

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "flex gap-1";

    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "text-neutral-500";

    function render(isDesktop: boolean) {
        const logo: string = isDesktop ? logoIcon.desktop : logoIcon.mobile;
        const label: string = isDesktop ? "Personal Best: " : "Best: ";
        const wpmValue: string = localStorage.getItem("personal-best") ?? "0";

        spanElement.textContent = label;

        paragraphElement.innerHTML = "";
        paragraphElement.append(spanElement, `${wpmValue} WPM`);

        headingElement.innerHTML = "";
        headingElement.insertAdjacentHTML("beforeend", ICON_PERSONAL_BEST);
        headingElement.append(paragraphElement);

        headerElement.innerHTML = "";
        headerElement.insertAdjacentHTML("beforeend", logo);
        headerElement.append(headingElement);
    }

    MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) => {
        render(e.matches);
    });

    render(MEDIA_QUERY.matches);

    return headerElement;
}
