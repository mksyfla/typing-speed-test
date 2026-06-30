import { ICON_ARROW_DOWN } from "../../utils/svg";
import { button } from "../button";
import { classnameTypes } from "../../utils/classname.types";
import { stateProps, stateStore } from "../../utils/state";

interface mainHeaderProps {
    stats: {
        key: string;
        value: string;
    }[];
}

export function mainHeader(props: mainHeaderProps): HTMLElement {
    const classname: classnameTypes = {
        base: "shrink-0 bg-neutral-900 pb-4 flex gap-4 border-b border-neutral-500",
        desktop: "lg:flex-row lg:justify-between",
        mobile: "flex-col justify-center",
    };

    const mainHeader: HTMLElement = document.createElement("div");
    mainHeader.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const stats: HTMLElement[] = props.stats.map((stat) =>
        statsListElement({ heading: stat.key, value: stat.value }),
    );

    const settingsList: HTMLElement[] = [
        selectionElement({
            header: "Difficulty",
            values: ["Easy", "Medium", "Hard"],
        }),
        selectionElement({
            header: "Mode",
            values: ["Timed (60s)", "Passage"],
        }),
    ];

    mainHeader.append(
        headerSection({ child: stats }),
        headerSection({ child: settingsList, classname: "gap-4 lg:gap-0" }),
    );

    return mainHeader;
}

interface headerSectionProps {
    child: HTMLElement[];
    classname?: string;
}

function headerSection(props: headerSectionProps): HTMLElement {
    const headerSection: HTMLElement = document.createElement("div");
    headerSection.append(...props.child);
    headerSection.className = `${props.classname ?? ""} flex flex-row w-full lg:w-fit`;

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
    headingElement.textContent = props.heading;

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "font-bold text-2xl";
    paragraphElement.textContent = props.value;

    statsElement.append(headingElement, paragraphElement);

    return statsElement;
}

interface selectionElementProps {
    header: string;
    values: string[];
}

function selectionElement(props: selectionElementProps): HTMLElement {
    const selectionElement: HTMLElement = document.createElement("div");

    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "inline";
    spanElement.textContent = props.header + ":";

    const listContainer: HTMLDivElement = document.createElement("div");
    listContainer.className =
        // "absolute w-full bg-neutral-800 rounded-lg mt-2 hidden";
        "absolute w-full bg-neutral-800 rounded-lg mt-2";

    let isDropdownDown: boolean = false;

    const buttonDropdown: HTMLButtonElement = button({
        classname: "w-full px-2 py-1 gap-3 border border-neutral-500",
        text: "",
        trailingIcon: ICON_ARROW_DOWN,
        event: toggleList,
    });

    function toggleList() {
        isDropdownDown = !isDropdownDown;
        render(stateStore.getState(), "toggle selector list");
        // listContainer.classList.toggle("hidden");
    }

    const type = props.header.toLowerCase();

    function render(state: stateProps, description: string) {
        console.log("render selectionElement", description);

        selectionElement.className = state.isDesktop
            ? "flex flex-row items-center gap-2 first:pr-4 last:pl-4 not-last:border-r border-neutral-500"
            : "relative flex-1";

        const selected = type === "difficulty" ? state.difficulty : state.mode;

        const selectionList = props.values.map((value, index) =>
            selectionListElement({
                option: value,
                selected: index === selected,
                event: () => {
                    if (type === "difficulty") {
                        stateStore.setState(
                            { difficulty: index },
                            `select difficulty to ${index}`,
                        );
                    } else {
                        stateStore.setState(
                            { mode: index },
                            `select mode to ${index}`,
                        );
                    }
                },
            }),
        );

        if (state.isDesktop) {
            isDropdownDown = false;

            selectionElement.innerHTML = "";
            selectionElement.append(spanElement, ...selectionList);
        } else {
            if (isDropdownDown) listContainer.classList.remove("hidden");
            else listContainer.classList.add("hidden");

            listContainer.innerHTML = "";
            listContainer.append(...selectionList);

            buttonDropdown.children[0].textContent =
                selectionList[selected].innerHTML;

            selectionElement.innerHTML = "";
            selectionElement.append(buttonDropdown, listContainer);
        }
    }

    stateStore.subscribe(render);

    render(stateStore.getState(), "Initialization");

    return selectionElement;
}

interface selectionListElementProps {
    option: string;
    selected: boolean;
    event: () => void;
}

function selectionListElement(props: selectionListElementProps): HTMLElement {
    const classname: classnameTypes = {
        base: "px-2 flex gap-3 items-center cursor-pointer border-neutral-500",
        desktop: "lg:py-1 lg:border lg:rounded-md lg:before:content-none",
        mobile: "py-2 not-last:border-b before:size-4 before:border before:rounded-full",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `
        ${props.selected ? "before:border-4 before:border-blue-400 lg:border-blue-400 lg:text-blue-400" : ""}
        ${classname.base}
        ${classname.desktop}
        ${classname.mobile}
    `;
    selectionElement.textContent = props.option;
    selectionElement.addEventListener("click", props.event);

    return selectionElement;
}
