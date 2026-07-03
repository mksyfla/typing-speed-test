import { store } from "../../utils/state";
import { mainFooter } from "./main.footer";
import { mainHeader } from "./main.header";
import { mainMain } from "./main.main";

export interface gameSettingsStateProps {
    difficulty: number;
    mode: number;
}

const gameSettingsState: gameSettingsStateProps = {
    difficulty: 0,
    mode: 0,
};

export const gameSettingsStateStore = store<gameSettingsStateProps>(gameSettingsState);

export function mainElement(): HTMLElement {
    const main: HTMLElement = document.createElement("main");
    main.className = "flex min-h-0 flex-1 flex-col";

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
