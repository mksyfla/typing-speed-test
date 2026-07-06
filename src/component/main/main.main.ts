import { classnameTypes } from "../../utils/classname.types";
import { DATA_TEXT } from "../../utils/fetch";
import {
    ICON_COMPLETED,
    ICON_COMPLETED_PERSONAL_BEST,
    ICON_RESTART,
    SVG_ICON_DATA_TYPES,
} from "../../utils/svg";
import { button } from "../button";
import { gameSettingsStateProps, gameSettingsStateStore } from "./main";

export function mainMain(): HTMLElement {
    const gameState = gameSettingsStateStore.getState();

    const mainElement: HTMLElement = document.createElement("div");
    mainElement.className = "relative w-full flex-1 overflow-y-auto text-neutral-400";

    const renderedText: HTMLElement = document.createElement("div");
    renderedText.className =
        "h-full overflow-hidden bg-neutral-900 text-3xl leading-10 font-normal tracking-wide";

    const textInput: HTMLTextAreaElement = document.createElement("textarea");
    textInput.className = "absolute top-0 h-full w-full resize-none opacity-0";
    textInput.autofocus = true;

    const startElement: HTMLElement = start(gameState);

    mainElement.append(renderedText, textInput, startElement);

    async function renderStart(state: gameSettingsStateProps) {
        textInput.value = "";
        textInput.focus();

        if (state.start) {
            renderedText.textContent = state.text;
            startElement.classList.add("hidden");

            textInput.addEventListener("input", () => {
                const text = state.text;
                const userInput = textInput.value;

                renderedText.innerHTML = Array.from(text)
                    .map((_, i) => {
                        const t = text[i];
                        const u = userInput[i];

                        if (i < userInput.length) {
                            if (u === t) {
                                return `<span class="text-green-500">${t}</span>`;
                            } else {
                                return `<span class="text-red-500 underline">${t}</span>`;
                            }
                        } else if (i === userInput.length) {
                            return `<span class="rounded-md bg-neutral-700">${t}</span>`;
                        } else {
                            return t;
                        }
                    })
                    .join("");
            });
        } else {
            startElement.classList.remove("hidden");
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
        firstCompleted: finishType;
        completed: finishType;
        personalBest: finishType;
    } = {
        firstCompleted: {
            logo: ICON_COMPLETED,
            heading: "Baseline Established!",
            paragraph: "You’ve set the bar. Now the real challenge begins-time to beat it.",
            buttonText: "Beat This Score!",
        },
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
    finishElement.className = "flex h-full w-full flex-col items-center";

    const logoContainer: HTMLDivElement = document.createElement("div");
    logoContainer.className = "mb-8";

    const textContainer: HTMLDivElement = document.createElement("div");
    textContainer.className = "mb-4 flex flex-col gap-2 text-center";

    const heading: HTMLHeadingElement = document.createElement("h3");
    heading.className = "text-3xl leading-tight font-semibold";

    const paragraph: HTMLParagraphElement = document.createElement("p");
    paragraph.className = "text-base leading-tight font-normal text-neutral-500";

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

    stats.map((stat) => statsList({ heading: stat.key, value: stat.value }));

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

        return statListElement;
    }

    const buttonElement: HTMLButtonElement = button({
        classname: "bg-neutral-0 p-4 text-neutral-800",
        text: "",
        trailingIcon: ICON_RESTART(true),
        event: () =>
            gameSettingsStateStore.setState({
                start: false,
                userInput: "",
                characterRight: 0,
                characterWrong: 0,
            }),
    });

    return finishElement;
    `
    <div class="">
        <div class="">
            ${iconCompleted}
        </div>

        <div class="">
            <h3 class="">Baseline Established!</h3>
            <p class="">
                You’ve set the bar. Now the real challenge begins—time to beat it.
            </p>
        </div>

        <div class="">
            <div class="">
                <h3 class="">
                    WPM
                </h3>
                <p class="">85</p>
            </div>
        </div>
    </div>
    `;
}

function start(state: gameSettingsStateProps): HTMLElement {
    const startElement: HTMLElement = document.createElement("div");
    startElement.className =
        "absolute top-0 flex h-full w-full flex-col items-center justify-center gap-4 bg-neutral-900/40 backdrop-blur-md";

    const buttonElement: HTMLButtonElement = button({
        classname: "text-neutral-0 bg-blue-600 p-4",
        text: "Start Typing Test",
        event: () => {
            let text: string;
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
            gameSettingsStateStore.setState({ start: true, text: text });
        },
    });

    startElement.append(buttonElement);

    return startElement;
}
