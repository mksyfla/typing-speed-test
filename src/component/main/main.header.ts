import { displayStateProps, displayStateStore } from "../../utils/breakpoint";
import { classnameTypes } from "../../utils/classname.types";
import { ICON_ARROW_DOWN } from "../../utils/svg";
import { button } from "../button";
import { gameSettingsStateProps, gameSettingsStateStore } from "./main";

export function mainHeader(): HTMLElement {
    const classname: classnameTypes = {
        base: "z-10 flex shrink-0 gap-4 border-b border-neutral-500 bg-neutral-900 pb-4",
        desktop: "lg:flex-row lg:justify-between",
        mobile: "flex-col justify-center",
    };

    const mainHeader: HTMLElement = document.createElement("div");
    mainHeader.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const stats: HTMLElement[] = [
        { key: "WPM:", value: "0" },
        { key: "Accuracy:", value: "100%" },
        { key: "Time:", value: "0:60" },
    ].map((stat) => statsListElement({ heading: stat.key, value: stat.value }));

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

    function render(state: gameSettingsStateProps) {
        if (!state.finish) {
            mainHeader.classList.remove("hidden");
        } else {
            mainHeader.classList.add("hidden");
        }
    }

    gameSettingsStateStore.subscribe(render);

    render(gameSettingsStateStore.getState());

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
        desktop: "lg:flex-row lg:px-5 lg:first:pl-0 lg:last:pr-0",
        mobile: "flex-col",
    };

    const statsElement: HTMLElement = document.createElement("div");
    statsElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const headingElement: HTMLHeadingElement = document.createElement("h3");
    headingElement.className = "text-base leading-tight font-normal text-neutral-500";
    headingElement.textContent = props.heading;

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "text-xl leading-tight font-semibold";
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
    spanElement.className = "inline text-base leading-tight font-normal text-neutral-500";
    spanElement.textContent = props.header + ":";

    const listContainerClassname: classnameTypes = {
        base: "",
        desktop: "lg:static lg:mt-0 lg:w-fit lg:rounded-none lg:bg-transparent lg:flex lg:gap-2",
        mobile: "absolute mt-2 w-full rounded-lg bg-neutral-800",
    };

    const listContainer: HTMLDivElement = document.createElement("div");
    listContainer.className = `${listContainerClassname.desktop} ${listContainerClassname.mobile}`;

    let isDropdownDown: boolean = false;

    const buttonDropdown: HTMLButtonElement = button({
        classname: "w-full border border-neutral-500 px-2 py-1",
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
                    ? gameSettingsStateStore.setState({
                          difficulty: index,
                          start: false,
                          finish: false,
                      })
                    : gameSettingsStateStore.setState({
                          mode: index,
                          start: false,
                          finish: false,
                      }),
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

        console.log("rendering on header", state.difficulty);

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
        base: "flex cursor-pointer items-center gap-2 border-neutral-500 px-2 text-base leading-tight font-normal",
        desktop: "lg:rounded-md lg:border lg:py-1 lg:before:content-none",
        mobile: "py-2 not-last:border-b before:size-3 before:rounded-full before:border",
    };

    const selectionElement: HTMLElement = document.createElement("div");
    selectionElement.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;
    selectionElement.textContent = props.option;
    selectionElement.addEventListener("click", props.event);

    return selectionElement;
}
