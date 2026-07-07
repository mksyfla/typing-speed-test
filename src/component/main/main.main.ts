import { classnameTypes } from "../../utils/classname.types";
import { DATA_TEXT } from "../../utils/fetch";
import {
    ICON_COMPLETED,
    ICON_COMPLETED_PERSONAL_BEST,
    ICON_RESTART,
    SVG_ICON_DATA_TYPES,
} from "../../utils/svg";
import { button } from "../button";
import {
    gameSettingsStateProps,
    gameSettingsStateStore,
    gameStatsStateProps,
    gameStatsStateStore,
} from "./main";

export function mainMain(): HTMLElement {
    const gameState = gameSettingsStateStore.getState();
    let characterRight: number = 0;
    let characterWrong: number = 0;

    const mainElement: HTMLElement = document.createElement("div");
    mainElement.className = "relative w-full flex-1 text-neutral-400 overflow-y-auto scroll-smooth";

    const renderedText: HTMLElement = document.createElement("div");
    renderedText.className =
        "relative w-full bg-neutral-900 text-3xl leading-10 font-normal tracking-wide cursor-none";

    const textInput: HTMLTextAreaElement = document.createElement("textarea");
    textInput.className = "absolute top-0 h-full w-full resize-none opacity-0 cursor-none";
    textInput.autofocus = true;
    textInput.addEventListener("input", () => {
        const text = gameSettingsStateStore.getState().text;
        const userInput = textInput.value;

        characterRight = 0;
        characterWrong = 0;

        renderedText.innerHTML = Array.from(text)
            .map((_, i) => {
                const t = text[i];
                const u = userInput[i];

                if (i < userInput.length) {
                    if (u === t) {
                        characterRight += 1;
                        return `<span class="text-green-500">${t}</span>`;
                    } else {
                        characterWrong += 1;
                        return `<span class="text-red-500 underline">${t}</span>`;
                    }
                } else if (i === userInput.length) {
                    return `<span id="active-cursor" class="rounded-md bg-neutral-700">${t}</span>`;
                } else {
                    return t;
                }
            })
            .join("");

        const cursorElement = document.getElementById("active-cursor") as HTMLSpanElement;

        if (cursorElement) {
            const containerHeight = mainElement.clientHeight;
            const cursorTop = cursorElement.offsetTop;
            const cursorHeight = cursorElement.clientHeight;
            const scrollToTarget = cursorTop - containerHeight / 2 + cursorHeight / 2;

            mainElement.scrollTop = scrollToTarget;
        }

        if (text.length <= userInput.length) {
            gameSettingsStateStore.setState({
                finish: true,
                start: false,
            });
        }

        const settingState = gameSettingsStateStore.getState();
        let wpm = 0;

        if (settingState.startTimer != null) {
            const elapsedMinutes = (Date.now() - settingState.startTimer) / 60000;
            wpm = elapsedMinutes > 0 ? Math.round(characterRight / 5 / elapsedMinutes) : 0;
        }

        gameStatsStateStore.setState({
            characterRight: characterRight,
            characterWrong: characterWrong,
            wpm: wpm,
        });
    });

    const startElement: HTMLElement = start();
    const finishElement: HTMLElement = finish();

    mainElement.append(renderedText, textInput, startElement, finishElement);

    function renderStart(state: gameSettingsStateProps) {
        textInput.value = "";
        textInput.focus();

        if (state.finish) {
            finishElement.classList.remove("hidden");
            startElement.classList.add("hidden");
            renderedText.classList.add("hidden");
            textInput.classList.add("hidden");
        } else if (!state.start) {
            startElement.classList.remove("hidden");
            finishElement.classList.add("hidden");
            renderedText.classList.add("hidden");
            textInput.classList.add("hidden");
        } else {
            renderedText.classList.remove("hidden");
            textInput.classList.remove("hidden");
            startElement.classList.add("hidden");
            finishElement.classList.add("hidden");

            if (textInput.value === "") {
                renderedText.textContent = state.text;
                mainElement.scrollTop = 0;
            }

            textInput.focus();
        }
    }

    gameSettingsStateStore.subscribe(renderStart);

    renderStart(gameState);

    return mainElement;
}

function finish(): HTMLElement {
    interface finishType {
        logo: SVG_ICON_DATA_TYPES;
        heading: string;
        paragraph: string;
        buttonText: string;
    }

    const finishData: {
        completed: finishType;
        personalBest: finishType;
    } = {
        completed: {
            logo: ICON_COMPLETED,
            heading: "Test Completed!",
            paragraph: "Solid run. Keep pushing to beat your high score.",
            buttonText: "Go Again!",
        },
        personalBest: {
            logo: ICON_COMPLETED_PERSONAL_BEST,
            heading: "High Score Smashed!",
            paragraph: "You've getting faster. That was incredible typing.",
            buttonText: "Beat This Score!",
        },
    };

    const finishElement: HTMLElement = document.createElement("div");
    finishElement.className = "mt-10 flex h-fit w-full flex-col items-center";

    const logoContainer: HTMLDivElement = document.createElement("div");
    logoContainer.className = "mb-8";
    logoContainer.innerHTML = finishData.completed.logo;

    const textContainer: HTMLDivElement = document.createElement("div");
    textContainer.className = "mb-4 flex flex-col gap-2 text-center";

    const heading: HTMLHeadingElement = document.createElement("h3");
    heading.className = "text-3xl leading-tight font-semibold text-neutral-0";
    heading.textContent = finishData.completed.heading;

    const paragraph: HTMLParagraphElement = document.createElement("p");
    paragraph.className = "text-base leading-tight font-normal text-neutral-500";
    paragraph.textContent = finishData.completed.paragraph;

    const statsElementClassname: classnameTypes = {
        base: "mb-10 flex",
        desktop: "lg:w-[40%] lg:flex-row lg:gap-5",
        mobile: "w-full flex-col gap-2.5",
    };

    const statsElement: HTMLDivElement = document.createElement("div");
    statsElement.className = `${statsElementClassname.base} ${statsElementClassname.desktop} ${statsElementClassname.mobile}`;

    const wpmStats: HTMLDivElement = statsList({ heading: "WPM", value: "0" });
    const accuracyStats: HTMLDivElement = statsList({ heading: "Accuracy", value: "0%" });
    const charactersStats: HTMLDivElement = statsList({ heading: "Characters", value: "0/0" });

    statsElement.append(wpmStats, accuracyStats, charactersStats);

    interface statsListElementProps {
        heading: string;
        value: string;
    }

    function statsList(props: statsListElementProps): HTMLDivElement {
        const statListClassname: classnameTypes = {
            base: "rounded-lg border border-neutral-500 px-6 py-4",
            desktop: "lg:flex-1",
            mobile: "w-full",
        };

        const statListElement: HTMLDivElement = document.createElement("div");
        statListElement.className = `${statListClassname.base} ${statListClassname.desktop} ${statListClassname.mobile}`;

        const statsHeading: HTMLHeadingElement = document.createElement("h3");
        statsHeading.className = "text-base leading-tight font-normal text-neutral-500";
        statsHeading.textContent = props.heading;

        const statsParagraph: HTMLHeadingElement = document.createElement("p");
        statsParagraph.className = "text-neutral-0 text-xl leading-tight font-semibold";
        statsParagraph.textContent = props.value;

        statListElement.append(statsHeading, statsParagraph);

        return statListElement;
    }

    const buttonElement: HTMLButtonElement = button({
        classname: "bg-neutral-0 p-4 text-neutral-800",
        text: finishData.completed.buttonText,
        trailingIcon: ICON_RESTART(true),
        event: () => {
            gameSettingsStateStore.setState({
                start: false,
                finish: false,
            });
            gameStatsStateStore.setState({
                characterRight: 0,
                characterWrong: 0,
                wpm: 0,
            });
        },
    });

    textContainer.append(heading, paragraph);
    finishElement.append(logoContainer, textContainer, statsElement, buttonElement);

    function renderStats(state: gameStatsStateProps) {
        const totalType: number = state.characterRight + state.characterWrong;
        const accuracy: number = Math.floor((state.characterRight / totalType) * 100);
        const wpm: number = state.wpm;

        wpmStats.getElementsByTagName("p").item(0)!.textContent = isNaN(wpm) ? "0" : wpm.toString();
        accuracyStats.getElementsByTagName("p").item(0)!.textContent = isNaN(accuracy)
            ? "0"
            : accuracy.toString() + "%";
        charactersStats.getElementsByTagName("p").item(0)!.innerHTML =
            `<span class="text-green-500">${state.characterRight}</span>/<span class="text-red-500">${state.characterWrong}</span>`;
    }

    gameStatsStateStore.subscribe(renderStats);
    renderStats(gameStatsStateStore.getState());

    return finishElement;
}

function start(): HTMLElement {
    const startElement: HTMLElement = document.createElement("div");
    startElement.className =
        "absolute top-0 flex h-full w-full flex-col items-center justify-center gap-4";

    let text: string;

    function render(state: gameSettingsStateProps) {
        const idx = Math.floor(Math.random() * 10);

        switch (state.difficulty) {
            case 0:
                text = DATA_TEXT["easy"][idx];
                break;
            case 1:
                text = DATA_TEXT["medium"][idx];
                break;
            case 2:
                text = DATA_TEXT["hard"][idx];
                break;
            default:
                text = DATA_TEXT["easy"][idx];
                break;
        }
    }

    gameSettingsStateStore.subscribe(render);

    const buttonElement: HTMLButtonElement = button({
        classname: "text-neutral-0 bg-blue-600 p-4",
        text: "Start Typing Test",
        event: () => {
            render(gameSettingsStateStore.getState());
            gameSettingsStateStore.setState({
                start: true,
                finish: false,
                text: text,
                startTimer: Date.now(),
            });
        },
    });

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "text-base leading-tight font-normal text-neutral-0";
    paragraphElement.textContent = "Or click the text and start typing";

    startElement.append(buttonElement, paragraphElement);

    return startElement;
}
