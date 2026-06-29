import { MEDIA_QUERY } from "../../utils/breakpoint";
import { ICON_ARROW_DOWN } from "../../utils/svg";
import { button } from "../button";
import { classnameTypes } from "../../utils/classname.types";

interface mainHeaderProps {
    stats: {
        key: string;
        value: string;
    }[];
    difficulty: number;
    difficultyList: string[];
    mode: number;
    modeList: string[];
}

export function mainHeader(props: mainHeaderProps): HTMLElement {
    const classname: classnameTypes = {
        base: "pb-4 flex gap-4 border-b border-neutral-500",
        desktop: "lg:flex-row lg:justify-between",
        mobile: "flex-col justify-center",
    };

    const mainHeader: HTMLElement = document.createElement("div");
    mainHeader.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const stats = props.stats.map((stat) =>
        statsListElement(stat.key, stat.value),
    );

    function render(isDesktop: boolean) {
        const settingsList: HTMLElement[] = [
            selectionElement("Difficulty:", props.difficultyList, isDesktop),
            selectionElement("Mode:", props.modeList, isDesktop),
        ];

        const settingsHeader: HTMLElement = isDesktop
            ? headerSection(settingsList, "lg:gap-0")
            : headerSection(settingsList);

        mainHeader.innerHTML = "";
        mainHeader.append(headerSection(stats), settingsHeader);
    }

    MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) =>
        render(e.matches),
    );

    render(MEDIA_QUERY.matches);

    return mainHeader;
}

function headerSection(
    child: HTMLElement[],
    addtionalclassname?: string,
): HTMLElement {
    const headerSection: HTMLElement = document.createElement("div");
    headerSection.className = `${addtionalclassname ?? ""} flex flex-row gap-4 w-full lg:w-fit`;
    headerSection.append(...child);

    return headerSection;
}

function statsListElement(heading: string, value: string): HTMLElement {
    const classname: classnameTypes = {
        base: "flex flex-1 gap-1 not-last:border-r border-neutral-500 items-center",
        desktop: "lg:flex-row lg:px-6 lg:first:pl-0 lg:last:pr-0",
        mobile: "flex-col",
    };

    const statsElement: HTMLElement = document.createElement("div");
    statsElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const headingElement: HTMLHeadingElement = document.createElement("h3");
    headingElement.className = "text-neutral-500 lg:text-xl";

    const paragraphElement: HTMLParagraphElement = document.createElement("h3");
    paragraphElement.className = "font-bold text-2xl";

    function render() {
        headingElement.textContent = heading;
        paragraphElement.textContent = value;

        statsElement.innerHTML = "";
        statsElement.append(headingElement, paragraphElement);
    }

    render();

    return statsElement;
}

function selectionListElement(option: string): HTMLElement {
    const classname: classnameTypes = {
        base: "px-2 flex gap-3 items-center border-neutral-500 cursor-pointer",
        desktop: "lg:py-1 lg:border lg:rounded-md lg:before:content-none",
        mobile: "py-2 not-last:border-b before:size-4 before:border before:rounded-full",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    function render() {
        selectionElement.textContent = option;
    }

    render();

    return selectionElement;
}

function selectionElement(
    header: string,
    values: string[],
    isDesktop: boolean,
): HTMLElement {
    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = isDesktop
        ? "flex flex-row items-center gap-2 first:pr-4 last:pl-4 not-last:border-r border-neutral-500"
        : "relative flex-1";

    function render() {
        const selectionList = values.map((v) => selectionListElement(v));

        if (isDesktop) {
            const spanElement: HTMLSpanElement = document.createElement("span");
            spanElement.className = "inline";
            spanElement.textContent = header;

            selectionElement.innerHTML = "";
            selectionElement.append(spanElement, ...selectionList);
        } else {
            const listContainer = document.createElement("div");
            listContainer.className =
                "absolute w-full bg-neutral-800 rounded-lg mt-2 hidden";
            listContainer.innerHTML = "";
            listContainer.append(...selectionList);

            function toggleList() {
                listContainer.classList.toggle("hidden");
            }

            const buttonDropdown = button({
                classname: "w-full px-2 py-1 gap-3 border border-neutral-500",
                text: header,
                trailingIcon: ICON_ARROW_DOWN,
                event: toggleList,
            });
            selectionElement.innerHTML = "";
            selectionElement.append(buttonDropdown, listContainer);
        }
    }

    render();

    return selectionElement;
}
