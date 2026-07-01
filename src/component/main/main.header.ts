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
        base: "flex shrink-0 gap-2 border-b border-neutral-500 bg-neutral-900 pb-2",
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
        headerSection({ child: settingsList, classname: "gap-2 lg:gap-0" }),
    );

    return mainHeader;
}

interface headerSectionProps {
    child: HTMLElement[];
    classname?: string;
}

function headerSection(props: headerSectionProps): HTMLElement {
    const classname: classnameTypes = {
        base: "flex flex-row",
        desktop: "lg:w-fit",
        mobile: "w-full",
    };

    const headerSection: HTMLElement = document.createElement("div");
    headerSection.append(...props.child);
    headerSection.className = `${props.classname ?? ""} ${classname.base} ${classname.desktop} ${classname.mobile}`;

    return headerSection;
}

interface statsListElementProps {
    heading: string;
    value: string;
}

function statsListElement(props: statsListElementProps): HTMLElement {
    const classname: classnameTypes = {
        base: "flex flex-1 items-center gap-1 border-neutral-500 not-last:border-r",
        desktop: "lg:flex-row lg:px-4 lg:first:pl-0 lg:last:pr-0",
        mobile: "flex-col",
    };

    const statsElement: HTMLElement = document.createElement("div");
    statsElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const headingElement: HTMLHeadingElement = document.createElement("h3");
    headingElement.className = "text-sm text-neutral-500 lg:text-base";
    headingElement.textContent = props.heading;

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "text-lg font-bold lg:text-xl";
    paragraphElement.textContent = props.value;

    statsElement.append(headingElement, paragraphElement);

    return statsElement;
}

interface selectionElementProps {
    header: string;
    values: string[];
}

function selectionElement(props: selectionElementProps): HTMLElement {
    const classname: classnameTypes = {
        base: "",
        desktop:
            "lg:flex lg:flex-none lg:flex-row lg:items-center lg:gap-2 lg:border-neutral-500 lg:not-last:border-r lg:first:pr-4 lg:last:pl-4",
        mobile: "relative flex-1",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${classname.desktop} ${classname.mobile}`;

    const spanElement: HTMLSpanElement = document.createElement("span");
    spanElement.className = "inline text-neutral-500";
    spanElement.textContent = props.header + ":";

    const listContainer: HTMLDivElement = document.createElement("div");
    listContainer.className = "absolute mt-1 w-full rounded-lg bg-neutral-800";

    let isDropdownDown: boolean = false;

    const buttonDropdown: HTMLButtonElement = button({
        classname:
            "w-full gap-2 border border-neutral-500 px-2 py-1 text-sm font-normal",
        text: "",
        trailingIcon: ICON_ARROW_DOWN,
        event: toggleList,
    });

    function toggleList() {
        isDropdownDown = !isDropdownDown;
        render(stateStore.getState(), "toggle selector list");
    }

    const type = props.header.toLowerCase();

    function render(state: stateProps, description: string) {
        console.log("render selectionElement", description);

        const selected: number =
            type === "difficulty" ? state.difficulty : state.mode;

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
        base: "flex cursor-pointer items-center gap-2 border-neutral-500 px-2",
        desktop:
            "lg:rounded-md lg:border lg:py-1 lg:text-base lg:before:content-none",
        mobile: "py-2 text-sm not-last:border-b before:size-3 before:rounded-full before:border",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${props.selected ? "before:border-3 before:border-blue-400 lg:border-blue-400 lg:text-blue-400" : ""} ${classname.base} ${classname.desktop} ${classname.mobile}`;
    // selectionElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;
    selectionElement.textContent = props.option;
    selectionElement.addEventListener("click", props.event);

    return selectionElement;
}
