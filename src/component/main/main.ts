import { classnameTypes } from "../../utils/classname.types";
import { store } from "../../utils/state";
import { mainHeader } from "./main.header";
import { mainFooter } from "./main.footer";
import { mainMain } from "./main.main";

export interface gameSettingsStateProps {
    start: boolean;
    difficulty: number;
    mode: number;
    text: string;
    userInput: string;
    characterRight: number;
    characterWrong: number;
}

const gameSettingsState: gameSettingsStateProps = {
    start: false,
    difficulty: 0,
    mode: 0,
    text: "",
    userInput: "",
    characterRight: 0,
    characterWrong: 0,
};

export const gameSettingsStateStore = store<gameSettingsStateProps>(gameSettingsState);

export function mainElement(): HTMLElement {
    const classname: classnameTypes = {
        base: "flex min-h-0 flex-1 flex-col",
        desktop: "lg:gap-10",
        mobile: "gap-5",
    };

    const main: HTMLElement = document.createElement("main");
    main.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    const header = mainHeader({
        stats: [
            { key: "WPM:", value: "0" },
            { key: "Accuracy:", value: "100%" },
            { key: "Time:", value: "0:60" },
        ],
    });

    main.append(header, mainMain(), mainFooter());

    return main;
}
