import { MEDIA_QUERY } from "../utils/breakpoint";
import {
    ICON_LOGO_DESKTOP,
    ICON_LOGO_MOBILE,
    ICON_PERSONAL_BEST,
    SVG_ICON_DATA_TYPES,
} from "../utils/svg";

export function header(): HTMLElement {
    const logoIcon: {
        mobile: SVG_ICON_DATA_TYPES;
        desktop: SVG_ICON_DATA_TYPES;
    } = {
        mobile: ICON_LOGO_MOBILE,
        desktop: ICON_LOGO_DESKTOP,
    };

    const personalBestIcon: SVG_ICON_DATA_TYPES = ICON_PERSONAL_BEST;

    const headerElement: HTMLElement = document.createElement("header");
    headerElement.className = "flex justify-between items-center pt-8";

    function render(isDesktop: boolean) {
        const logo: string = isDesktop ? logoIcon.desktop : logoIcon.mobile;
        const label: string = isDesktop ? "Personal Best: " : "Best: ";
        const wpmValue: string = localStorage.getItem("personal-best") ?? "0";

        headerElement.innerHTML = `
            ${logo}
            <div class="flex gap-2 items-center justify-end">
                ${personalBestIcon}
                <p class="flex gap-1">
                    <span class="text-neutral-500">${label}</span>
                    ${wpmValue} WPM
                </p>
            </div>
        `;
    }

    MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) => {
        render(e.matches);
    });

    render(MEDIA_QUERY.matches);

    return headerElement;
}
