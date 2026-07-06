import { classnameTypes } from "../../utils/classname.types";
import { DATA_TEXT } from "../../utils/fetch";
import {
    ICON_COMPLETED,
    ICON_COMPLETED_PERSONAL_BEST,
    ICON_RESTART,
    SVG_ICON_DATA_TYPES,
} from "../../utils/svg";
import { button } from "../button";
import { gameSettingsStateProps, gameSettingsStateStore, gameStatsStateStore } from "./main";

export function mainMain(): HTMLElement {
    const gameState = gameSettingsStateStore.getState();
    let characterRight: number = 0;
    let characterWrong: number = 0;

    const mainElement: HTMLElement = document.createElement("div");
    mainElement.className = "relative w-full flex-1 text-neutral-400";

    const renderedText: HTMLElement = document.createElement("div");
    renderedText.className =
        "h-full overflow-hidden bg-neutral-900 text-3xl leading-10 font-normal tracking-wide";

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
                    return `<span class="rounded-md bg-neutral-700">${t}</span>`;
                } else {
                    return t;
                }
            })
            .join("");

        if (text.length <= userInput.length) {
            console.log("finished");
            gameSettingsStateStore.setState({
                finish: true,
                start: false,
            });
        }

        gameStatsStateStore.setState({
            characterRight: characterRight,
            characterWrong: characterWrong,
        });
    });

    const startElement: HTMLElement = start();
    const finishElement: HTMLElement = finish();

    function renderStart(state: gameSettingsStateProps) {
        textInput.value = "";
        textInput.focus();

        if (!state.start || state.finish) {
            mainElement.innerHTML = "";

            if (state.finish) {
                mainElement.append(finishElement);
            } else {
                mainElement.append(startElement);
            }
        } else {
            renderedText.textContent = state.text;

            mainElement.innerHTML = "";
            mainElement.append(renderedText, textInput);
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
    finishElement.className = "mt-10 flex h-full w-full flex-col items-center";

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

    const stats = [
        { key: "WPM", value: "85" },
        { key: "Accuracy", value: "100%" },
        { key: "Characters", value: "120/5" },
    ];

    const stasListElement: HTMLDivElement[] = stats.map((stat) =>
        statsList({ heading: stat.key, value: stat.value }),
    );

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
        event: () =>
            gameSettingsStateStore.setState({
                start: false,
                finish: false,
            }),
    });

    textContainer.append(heading, paragraph);
    statsElement.append(...stasListElement);
    finishElement.append(logoContainer, textContainer, statsElement, buttonElement);

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
            });
        },
    });

    const paragraphElement: HTMLParagraphElement = document.createElement("p");
    paragraphElement.className = "text-base leading-tight font-normal text-neutral-0";
    paragraphElement.textContent = "Or click the text and start typing";

    startElement.append(buttonElement, paragraphElement);

    return startElement;
}
