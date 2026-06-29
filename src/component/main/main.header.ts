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
        statsListElement({ heading: stat.key, value: stat.value }),
    );

    function render(isDesktop: boolean) {
        const settingsList: HTMLElement[] = [
            selectionElement({
                header: "Difficulty:",
                values: props.difficultyList,
                isDesktop: isDesktop,
            }),
            selectionElement({
                header: "Mode:",
                values: props.modeList,
                isDesktop: isDesktop,
            }),
        ];

        const settingsHeader: HTMLElement = isDesktop
            ? headerSection({ child: settingsList, classname: "lg:gap-0" })
            : headerSection({ child: settingsList });

        mainHeader.innerHTML = "";
        mainHeader.append(headerSection({ child: stats }), settingsHeader);
    }

    MEDIA_QUERY.addEventListener("change", (e: MediaQueryListEvent) =>
        render(e.matches),
    );

    render(MEDIA_QUERY.matches);

    return mainHeader;
}

interface headerSectionProps {
    child: HTMLElement[];
    classname?: string;
}

function headerSection(props: headerSectionProps): HTMLElement {
    const headerSection: HTMLElement = document.createElement("div");
    headerSection.className = `${props.classname ?? ""} flex flex-row gap-4 w-full lg:w-fit`;
    headerSection.append(...props.child);

    return headerSection;
}

interface statsListElementProps {
    heading: string;
    value: string;
}

function statsListElement(props: statsListElementProps): HTMLElement {
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
        headingElement.textContent = props.heading;
        paragraphElement.textContent = props.value;

        statsElement.innerHTML = "";
        statsElement.append(headingElement, paragraphElement);
    }

    render();

    return statsElement;
}

interface selectionListElementProps {
    option: string;
}

function selectionListElement(props: selectionListElementProps): HTMLElement {
    const classname: classnameTypes = {
        base: "px-2 flex gap-3 items-center border-neutral-500 cursor-pointer",
        desktop: "lg:py-1 lg:border lg:rounded-md lg:before:content-none",
        mobile: "py-2 not-last:border-b before:size-4 before:border before:rounded-full",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    function render() {
        selectionElement.textContent = props.option;
    }

    render();

    return selectionElement;
}

interface selectionElementProps {
    header: string;
    values: string[];
    isDesktop: boolean;
}

function selectionElement(props: selectionElementProps): HTMLElement {
    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = props.isDesktop
        ? "flex flex-row items-center gap-2 first:pr-4 last:pl-4 not-last:border-r border-neutral-500"
        : "relative flex-1";

    function render() {
        const selectionList = props.values.map((value) =>
            selectionListElement({ option: value }),
        );

        if (props.isDesktop) {
            const spanElement: HTMLSpanElement = document.createElement("span");
            spanElement.className = "inline";
            spanElement.textContent = props.header;

            selectionElement.innerHTML = "";
            selectionElement.append(spanElement, ...selectionList);
        } else {
            const listContainer: HTMLDivElement = document.createElement("div");
            listContainer.className =
                "absolute w-full bg-neutral-800 rounded-lg mt-2 hidden";
            listContainer.innerHTML = "";
            listContainer.append(...selectionList);

            function toggleList() {
                listContainer.classList.toggle("hidden");
            }

            const buttonDropdown: HTMLButtonElement = button({
                classname: "w-full px-2 py-1 gap-3 border border-neutral-500",
                text: props.header,
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
