import { ICON_ARROW_DOWN } from "../../utils/svg";
import { button } from "../button";
import { classnameTypes } from "../../utils/classname.types";
import { displayStateProps, displayStateStore } from "../../utils/breakpoint";
import { gameSettingsStateProps, gameSettingsStateStore } from "./main";

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
        selectionElementUpdated({
            header: "Difficulty",
            values: ["Easy", "Medium", "Hard"],
        }),
        selectionElementUpdated({
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

function selectionElementUpdated(props: selectionElementProps): HTMLElement {
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
    listContainer.className =
        "absolute mt-1 hidden w-full rounded-lg bg-neutral-800 lg:static lg:mt-0 lg:flex lg:w-fit lg:gap-2 lg:rounded-none lg:bg-transparent";

    let isDropdownDown: boolean = false;

    const buttonDropdown: HTMLButtonElement = button({
        classname: "w-full gap-2 border border-neutral-500 px-2 py-1 text-sm font-normal",
        text: "",
        trailingIcon: ICON_ARROW_DOWN,
        event: toggleList,
    });

    function toggleList() {
        isDropdownDown = !isDropdownDown;
        renderDisplaySize(displayStateStore.getState());
    }

    const type = props.header.toLowerCase();

    const selectionList = props.values.map((value, index) =>
        selectionListElement({
            option: value,
            selected: index === 0,
            event: () =>
                type === "difficulty"
                    ? gameSettingsStateStore.setState(
                          { difficulty: index },
                          `select difficulty to ${index}`,
                      )
                    : gameSettingsStateStore.setState({ mode: index }, `select mode to ${index}`),
        }),
    );

    listContainer.append(...selectionList);
    selectionElement.append(spanElement, listContainer);

    function update(selected: number) {
        selectionList.forEach((list: HTMLElement, index: number) => {
            list.classList.toggle("before:border-4", index === selected);
            list.classList.toggle("before:border-blue-400", index === selected);
            list.classList.toggle("lg:border-blue-400", index === selected);
            list.classList.toggle("lg:text-blue-400", index === selected);
        });
    }

    function renderGameSetting(state: gameSettingsStateProps) {
        const selected: number = type === "difficulty" ? state.difficulty : state.mode;

        update(selected);
        buttonDropdown.children[0].textContent = selectionList[selected].textContent;
    }

    function renderDisplaySize(state: displayStateProps) {
        if (state.isDesktop) {
            isDropdownDown = false;
            selectionElement.firstChild?.replaceWith(spanElement);
        } else {
            listContainer.classList.toggle("hidden", !isDropdownDown);
            selectionElement.firstChild?.replaceWith(buttonDropdown);
        }
    }

    displayStateStore.subscribe(renderDisplaySize);
    gameSettingsStateStore.subscribe(renderGameSetting);

    renderDisplaySize(displayStateStore.getState());
    renderGameSetting(gameSettingsStateStore.getState());

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
        desktop: "lg:rounded-md lg:border lg:py-1 lg:text-base lg:before:content-none",
        mobile: "py-2 text-sm not-last:border-b before:size-3 before:rounded-full before:border",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;
    selectionElement.textContent = props.option;
    selectionElement.addEventListener("click", props.event);

    return selectionElement;
}
