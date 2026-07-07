import { displayStateProps, displayStateStore } from "../../utils/breakpoint";
import { classnameTypes } from "../../utils/classname.types";
import { ICON_ARROW_DOWN } from "../../utils/svg";
import { button } from "../button";
import {
    gameSettingsStateProps,
    gameSettingsStateStore,
    gameStatsStateProps,
    gameStatsStateStore,
} from "./main";

export function mainHeader(): HTMLElement {
    const classname: classnameTypes = {
        base: "z-10 flex shrink-0 gap-4 border-b border-neutral-500 bg-neutral-900 pb-4",
        desktop: "lg:flex-row lg:justify-between",
        mobile: "flex-col justify-center",
    };

    const mainHeader: HTMLElement = document.createElement("div");
    mainHeader.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const wpmStats: HTMLElement = statsListElement({ heading: "WPM", value: "0" });
    const accuracyStats: HTMLElement = statsListElement({ heading: "Accuracy", value: "0%" });
    const timeStats: HTMLElement = statsListElement({ heading: "Time", value: "0:60" });

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
        headerSection({ child: [wpmStats, accuracyStats, timeStats] }),
        headerSection({ child: settingsList, classname: "gap-2 lg:gap-0" }),
    );

    let timerInterval: ReturnType<typeof setInterval> | null = null;

    function render(state: gameSettingsStateProps) {
        if (!state.finish) {
            mainHeader.classList.remove("hidden");
        } else {
            mainHeader.classList.add("hidden");
        }

        if (state.start && !state.finish) {
            startTimer();
        } else {
            stopTimer();
        }
    }

    function formatTime(totalSeconds: number): string {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    function tick() {
        const state = gameSettingsStateStore.getState();
        const paragraph = timeStats.getElementsByTagName("p").item(0)!;

        if (!state.start || state.finish || state.startTimer == null) {
            stopTimer();
            return;
        }

        const elapsedSeconds = Math.floor((Date.now() - state.startTimer) / 1000);

        if (state.mode === 0) {
            const remaining = Math.max(60 - elapsedSeconds, 0);
            paragraph.textContent = formatTime(remaining);

            if (remaining <= 0) {
                gameSettingsStateStore.setState({
                    start: false,
                    finish: true,
                });
            }
        } else {
            paragraph.textContent = formatTime(elapsedSeconds);
        }
    }

    function startTimer() {
        stopTimer();
        tick();
        timerInterval = setInterval(tick, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function renderStats(state: gameStatsStateProps) {
        const totalType: number = state.characterRight + state.characterWrong;
        const accuracy: number = Math.floor((state.characterRight / totalType) * 100);
        const wpm: number = state.wpm;

        wpmStats.getElementsByTagName("p").item(0)!.textContent = isNaN(wpm) ? "0" : wpm.toString();
        accuracyStats.getElementsByTagName("p").item(0)!.textContent = isNaN(accuracy)
            ? "0"
            : accuracy.toString() + "%";
    }

    gameStatsStateStore.subscribe(renderStats);
    gameSettingsStateStore.subscribe(render);

    renderStats(gameStatsStateStore.getState());
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
            event: () => {
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
                      });

                gameStatsStateStore.setState({
                    characterRight: 0,
                    characterWrong: 0,
                    wpm: 0,
                });
            },
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
