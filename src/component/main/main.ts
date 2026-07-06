import { classnameTypes } from "../../utils/classname.types";
import { store } from "../../utils/state";
import { mainHeader } from "./main.header";
import { mainFooter } from "./main.footer";
import { mainMain } from "./main.main";

export interface gameSettingsStateProps {
    start: boolean;
    finish: boolean;
    difficulty: number;
    mode: number;
    text: string;
}

const gameSettingsState: gameSettingsStateProps = {
    start: false,
    finish: false,
    difficulty: 0,
    mode: 0,
    text: "",
};

export const gameSettingsStateStore = store<gameSettingsStateProps>(gameSettingsState);

export interface gameStatsStateProps {
    characterRight: number;
    characterWrong: number;
}

const gameStatsState: gameStatsStateProps = {
    characterRight: 0,
    characterWrong: 0,
};

export const gameStatsStateStore = store<gameStatsStateProps>(gameStatsState);

export function mainElement(): HTMLElement {
    const classname: classnameTypes = {
        base: "flex min-h-0 flex-1 flex-col overflow-y-hidden",
        desktop: "lg:gap-10",
        mobile: "gap-5",
    };

    const main: HTMLElement = document.createElement("main");
    main.className = `${classname.base} ${classname.desktop} ${classname.mobile}`;

    main.append(mainHeader(), mainMain(), mainFooter());

    return main;
}
